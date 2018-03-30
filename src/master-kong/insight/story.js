// import Promise from 'bluebird';
import _ from 'lodash';
import client from '../../mock/worker';

// dags
import factories from '../../factories';
import branch from '../branch.json';
import category from '../category.json';

import revenueExplanation from './content/revenue-explanation.md';
import volumeExplanation from './content/volume-explanation.md';
import promotionRecommendation from './content/promotion-recommendation.md';

const {
  fetchMasterKongRevenueForecast,
  fetchMasterKongRevenueGap,
  fetchMasterKongSalesLastYear,
  fetchMasterKongAnnualGoalCompRisk,
  mergeMonthAndYearData,
} = factories;

const simulation = client.call('masterKongSimulate');

export default {
  parameters: {
    branch: { default: undefined },
    category: { default: '冰茶' },
  },
  cells: {
    branch: {
      factory: () => Promise.resolve({
        defaultValue: '江西',
        enums: branch,
      }),
    },
    category: {
      factory: () => Promise.resolve({
        defaultValue: '冰茶',
        enums: category,
      }),
    },
    fetchRevenueGapPerCategory: {
      dependencies: ['@branch'],
      factory: fetchMasterKongRevenueGap(client, simulation, {
        metric: 'branch',
        otherMetric: 'category',
      }),
    },
    revenueGapPerCategory: {
      dependencies: ['fetchRevenueGapPerCategory'],
      factory: (rawData) => {
        if (_.some([rawData], _.isNil)) {
          return undefined;
        }

        return Promise.resolve({
          source: _.map(rawData, item => [
            item.category,
            `${item.month} ${item.year}`,
            Number(item.forecast) - Number(item.target),
          ]),
        });
      },
    },
    fetchRevenueGapPerBranch: {
      dependencies: ['@category'],
      factory: fetchMasterKongRevenueGap(client, simulation, {
        metric: 'category',
        otherMetric: 'branch',
      }),
    },
    revenueGapPerBranch: {
      dependencies: ['fetchRevenueGapPerBranch'],
      factory: (rawData) => {
        if (_.some([rawData], _.isNil)) {
          return undefined;
        }

        return Promise.resolve({
          source: _.map(rawData, item => [
            item.branch,
            `${item.month} ${item.year}`,
            Number(item.forecast) - Number(item.target),
          ]),
        });
      },
    },
    preMasterKongRevenueForecast: {
      dependencies: ['@category'],
      factory: fetchMasterKongRevenueForecast(client, simulation),
    },
    masterKongRevenueForecast: {
      dependencies: ['preMasterKongRevenueForecast'],
      factory: (data) => {
        const ret = data;
        return {
          source: ret,
          axisDimensions: ['timestamp'],
          key2name: {
            forecast: '预测值',
            target: '成交值',
            mape: '平均绝对百分比误差',
            ape: '平均绝对误差',
          },
        };
      },
    },
    fetchMasterKongSalesLastYear: {
      factory: fetchMasterKongSalesLastYear(),
    },
    salesLastYear: {
      dependencies: ['fetchMasterKongSalesLastYear'],
      factory: data =>
        // const data = _.map(_.range(365), i => ({
        //   time: i,
        //   sales: _.random(100, 500),
        //   predicate: _.random(100, 500),
        // }));
        ({
          source: data,
          axisDimensions: ['month'],
          metricDimensions: ['target', 'forecast'],
          key2name: {
            target: '实际销量',
            forecast: '预测销量',
          },
          markLine: [
            {
              name: '春节促销活动',
              xAxis: 3,
            },
            {
              name: '暑期促销活动',
              xAxis: 9,
            },
          ],
        })
      ,
    },
    fetchAnnualRevenueGoalRisk: {
      factory: fetchMasterKongAnnualGoalCompRisk({
        metricKey: 'Revenue',
      }),
    },
    fetchAnnualVolumeGoalRisk: {
      factory: fetchMasterKongAnnualGoalCompRisk({
        metricKey: 'Volume',
      }),
    },
    fetchAnnualRevenueCumulativeGoal: {
      dependencies: ['fetchAnnualRevenueGoalRisk'],
      factory: ({ data }) => {
        if (_.some([data], _.isNil)) {
          return undefined;
        }
        return client.call('cumulativeKeys', data, {
          measureKeys: ['target', 'forecast'],
          timestampKey: 'month',
        });
      },
    },
    fetchAnnualVolumeCumulativeGoal: {
      dependencies: ['fetchAnnualVolumeGoalRisk'],
      factory: ({ data }) => {
        if (_.some([data], _.isNil)) {
          return undefined;
        }
        return client.call('cumulativeKeys', data, {
          measureKeys: ['target', 'forecast'],
          timestampKey: 'month',
        });
      },
    },
    annualRevenueGoalRisk: {
      dependencies: ['fetchAnnualRevenueGoalRisk', 'fetchAnnualRevenueCumulativeGoal'],
      factory: mergeMonthAndYearData(),
    },
    annualVolumeGoalRisk: {
      dependencies: ['fetchAnnualVolumeGoalRisk', 'fetchAnnualVolumeCumulativeGoal'],
      factory: mergeMonthAndYearData(),
    },
    revenueExplanation: {
      factory: _.constant(revenueExplanation),
    },
    volumeExplanation: {
      factory: _.constant(volumeExplanation),
    },
    promotionRecommendation: {
      factory: _.constant(promotionRecommendation),
    },
  },
  id: '20002',
};
