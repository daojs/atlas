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
  fetchMasterKongVolumeBreakDown,
  fetchSalesLastYear,
  fetchMasterKongAnnualGoalCompRisk,
} = factories;

const simulation = client.call('masterKongSimulate');
function customizer(objValue, srcValue) {
  return _.merge(objValue[0], srcValue[0]);
}

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
          source: _.map(rawData, item => [item.category, item.month, item['销售指标差距']]),
          metricDimensions: ['销售指标差距'],
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
          source: _.map(rawData, item => [item.branch, item.month, item['销售指标差距']]),
          metricDimensions: ['销售指标差距'],
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
    fetchSalesLastYear: {
      factory: fetchSalesLastYear(),
    },
    salesLastYear: {
      factory: (response) => {
        const data = _.map(_.range(365), i => ({
          time: i,
          sales: _.random(100, 500),
          predicate: _.random(100, 500),
        }));
        return {
          source: data,
          axisDimensions: ['time'],
          key2name: {
            sales: '销售量',
            predicate: '预测值',
          },
          markArea: [
            [
              {
                name: '第一次活动',
                xAxis: 10,
              },
              {
                xAxis: 20,
              },
            ],
          ],
        };
      },
    },
    fetchAnnualRevenueGoalRisk: {
      factory: fetchMasterKongAnnualGoalCompRisk(client, simulation, {
        aggregation: {
          目标销售额: 'sum',
          预测销售额: 'sum',
        },
      }),
    },
    fetchAnnualVolumeGoalRisk: {
      factory: fetchMasterKongAnnualGoalCompRisk(client, simulation, {
        aggregation: {
          目标销量: 'sum',
          预测销量: 'sum',
        },
      }),
    },
    fetchAnnualRevenueCumulativeGoal: {
      dependencies: ['fetchAnnualRevenueGoalRisk'],
      factory: (data) => {
        if (_.some([data], _.isNil)) {
          return undefined;
        }
        return client.call('cumulativeKeys', data, {
          measureKeys: ['目标销售额', '预测销售额'],
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
          measureKeys: ['目标销量', '预测销量'],
          timestampKey: 'month',
        });
      },
    },
    annualRevenueGoalRisk: {
      dependencies: ['fetchAnnualRevenueGoalRisk', 'fetchAnnualRevenueCumulativeGoal'],
      factory: (gapData, cumulativeData) => {
        const transformCumulative = _.map(cumulativeData, ({ month, 目标销售额: targetCumulative, 预测销售额: forecastCumulative }) => (
          {
            month,
            目标销售额累积: targetCumulative,
            预测销售额累积: forecastCumulative,
          }
        ));
        const mergedData = _.mergeWith(_.groupBy(gapData, 'month'), _.groupBy(transformCumulative, 'month'), customizer);

        return {
          xAxisMetric: 'month',
          yAxisMetrics: [{
            metrics: ['目标销售额', '预测销售额'],
            type: 'bar',
          }, {
            metrics: ['目标销售额累积', '预测销售额累积'],
            type: 'line',
          }],
          source: _.values(mergedData),
        };
      },
    },
    annualVolumeGoalRisk: {
      dependencies: ['fetchAnnualVolumeGoalRisk', 'fetchAnnualVolumeCumulativeGoal'],
      factory: (gapData, cumulativeData) => {
        const transformCumulative = _.map(cumulativeData, ({ month, 目标销量: targetCumulative, 预测销量: forecastCumulative }) => (
          {
            month,
            目标销量累积: targetCumulative,
            预测销量累积: forecastCumulative,
          }
        ));
        const mergedData = _.mergeWith(_.groupBy(gapData, 'month'), _.groupBy(transformCumulative, 'month'), customizer);

        return {
          xAxisMetric: 'month',
          yAxisMetrics: [{
            metrics: ['目标销量', '预测销量'],
            type: 'bar',
          }, {
            metrics: ['目标销量累积', '预测销量累积'],
            type: 'line',
          }],
          source: _.values(mergedData),
        };
      },
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
