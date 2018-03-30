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
  fetchMasterKongVolumeForecast,
  fetchMasterKongVolumeBreakDown,
  fetchMasterKongSalesLastYear,
  fetchMasterKongAnnualGoalCompRisk,
  mergeMonthAndYearData,
} = factories;

function findLastYearItem(rawData, item) {
  return _.find(rawData, previous => previous.month === item.month
    && previous.year == item.year - 1
    && previous.category === item.category
    && previous.branch === item.branch,
  );
}

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
          source: rawData,
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
          source: rawData,
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
    preMasterKongVolumeForecast: {
      dependencies: ['@category'],
      factory: fetchMasterKongVolumeForecast(),
    },
    masterKongVolumeForecast: {
      dependencies: ['preMasterKongVolumeForecast'],
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
      factory: fetchMasterKongSalesLastYear(client, simulation),
    },
    salesLastYear: {
      dependencies: ['fetchMasterKongSalesLastYear'],
      factory: (data) => {
        console.log(data);
        if (_.some([data], _.isNil)) {
          return undefined;
        }
        return ({
          source: data,
          axisDimensions: ['Timetamp'],
          metricDimensions: ['Value', 'ExpectedValue'],
          key2name: {
            Value: '实际销量',
            ExpectedValue: '预测销量',
          },
          markLine: [
            {
              value: '春节促销活动',
              xAxis: 3,
            },
            {
              value: '暑期促销活动',
              xAxis: 9,
            },
          ],
        });
      },
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
      factory: (data) => {
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
      factory: (data) => {
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
      factory: mergeMonthAndYearData('Revenue'),
    },
    annualVolumeGoalRisk: {
      dependencies: ['fetchAnnualVolumeGoalRisk', 'fetchAnnualVolumeCumulativeGoal'],
      factory: mergeMonthAndYearData('Volume'),
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
