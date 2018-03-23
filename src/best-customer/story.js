import Promise from 'bluebird';
import _ from 'lodash';
import { fetchData, convertData, topNData } from '../transforms';
import client from '../mock/worker';

const simulation = client.call('simulate', {
  startDate: '2018-01-01',
  endDate: '2018-03-21',
  customerCount: 200,
});

export default {
  parameters: {
    measureUser: { default: undefined },
    time: { default: { start: '2018-01-01', end: '2018-02-01' } },
    measureCustomer: { default: undefined },
    granularityCustomer: { default: undefined },
    measureFavor: { default: undefined },
    dimensionFavor: { default: undefined },
  },
  cells: {
    measureUser: {
      factory: () => Promise.resolve({
        defaultValue: 'UU',
        enums: ['Revenue', 'UU', 'TransactionCount'],
      }),
    },
    bestUser: {
      dependencies: ['@measureUser', '@time'],
      factory: () => Promise.resolve({ department: 'STC', discipline: 'SDE' }),
    },
    measureCustomer: {
      factory: () => Promise.resolve({
        defaultValue: 'UU',
        enums: ['Revenue', 'UU', 'TransactionCount'],
      }),
    },
    bestCustomerQuery: {
      dependencies: ['@time', '@measureCustomer', 'bestUser'],
      factory: (time, measure, bestUser) => Promise.resolve({ time, measure, bestUser }),
    },
    mapCustomerMetric: {
      dependencies: ['@measureCustomer'],
      factory: measure => ({
        Revenue: { revenue: 'sum' },
        UU: { customerId: 'count' },
        TransactionCount: { transactionId: 'count' },
      }[measure]),
    },
    fetchCustomerTSAD: {
      dependencies: ['@time', 'mapCustomerMetric', 'bestUser'],
      factory: (time, metrics, bestUser) => {
        if (_.some([time, metrics, bestUser], _.isNil)) {
          return Promise.resolve([]);
        }
        return simulation
          .then(({ transaction }) => client.call('reduce', transaction, {
            metrics,
            dimensions: {
              timestamp: {
                type: 'days',
                from: time.start,
                to: time.end,
              },
              ...bestUser,
            },
          }))
          .then(id => client.call('read', id).finally(() => client.call('remove', id)));
      },
    },
    bestCustomerTSAD: {
      dependencies: ['fetchCustomerTSAD', 'mapCustomerMetric', 'bestUser'],
      factory: (data, metric, bestUser) => {
        if (_.some([data, metric, bestUser], _.isNil)) {
          return undefined;
        }
        const dimension = _.keys(metric)[0];
        const results = _.map(data, item => [item.timestamp, item[dimension]]);
        const expectedData = {
          data: results,
          meta: {
            headers: ['time', dimension],
            collaspsedColumns: bestUser,
          },
        };
        return convertData({
          ...expectedData,
          groupDimensions: [],
          axisDimensions: ['time'],
          metricDimensions: [dimension],
          serieNameTemplate: dimension,
        });
      },
    },
    granularityCustomer: {
      factory: () => Promise.resolve({
        defaultValue: 'day',
        enums: ['day', 'week', 'month'],
      }),
    },
    fetchCustomerExpencePerUserBucket: {
      dependencies: ['@time', '@granularityCustomer', 'bestUser'],
      factory: (time, granularity, bestUser) => {
        if (_.some([time, granularity, bestUser], _.isNil)) {
          return Promise.resolve([]);
        }

        return simulation
          .then(({ transaction }) => client.call('reduce', transaction, {
            metrics: {
              revenue: 'sum',
            },
            dimensions: {
              customerId: { type: 'any' },
              timestamp: {
                type: `${granularity}s`,
                from: time.start,
                to: time.end,
              },
              ...bestUser,
            },
          }))
          .then(id => client.call('reduce', id, {
            metrics: {
              revenue: 'average',
            },
            dimensions: {
              customerId: { type: 'any' },
            },
          }))
          .then(id => client.call('reduce', id, {
            metrics: {
              customerId: 'count',
            },
            dimensions: {
              revenue: {
                type: 'bins',
                step: 10,
              },
            },
          }))
          .then(id => client.call('read', id).finally(() => client.call('remove', id)));
      },
    },
    customerExpensePerUserBucket: {
      dependencies: ['fetchCustomerExpencePerUserBucket'],
      factory: (data) => {
        if (!data) {
          return undefined;
        }
        const results = _.map(data, item => [item.revenue, item.customerId]);
        const expectedData = {
          data: results,
          meta: {
            headers: ['revenue', 'customerId'],
          },
        };

        return convertData({
          ...expectedData,
          groupDimensions: [],
          axisDimensions: ['revenue'],
          metricDimensions: ['customerId'],
          serieNameTemplate: 'customerId',
        });
      },
    },
    customerExpensePerUserRank: {
      dependencies: ['@time', '@granularityCustomer', 'bestUser'],
      factory: (time, granularity, bestUser) => Promise.resolve({
        time, granularity, bestUser, measure: 'RevenuePerUU',
      }),
    },
    measureFavor: {
      factory: () => Promise.resolve({
        defaultValue: 'UU',
        enums: ['Revenue', 'UU', 'TransactionCount'],
      }),
    },
    dimensionFavor: {
      factory: () => Promise.resolve({
        defaultValue: 'BranchName',
        enums: ['BranchName', 'CardType', 'SKUType'],
      }),
    },
    favorBestCustomerReduce: {
      dependencies: ['@time', '@measureFavor', 'bestUser'],
      factory: (time, measure, bestUser) => Promise.resolve({
        time, measure, bestUser,
      }),
    },
    favorBestCustomerTrend: {
      dependencies: ['@time', '@measureFavor', 'bestUser'],
      factory: (time, measure, bestUser) => Promise.resolve({
        time, measure, bestUser,
      }),
    },
    usageMealCardReduce: {
      dependencies: ['@time', 'bestUser'],
      factory: (time, bestUser) => Promise.resolve({
        time, bestUser, measure: 'CardUU', Dimension: 'Channel',
      }),
    },
    usageMealCardBucketCRAP: {
      dependencies: ['@time', 'bestUser'],
      factory: (time, bestUser) => Promise.resolve({
        time, bestUser, measure: 'CardRechargeAmountPerUU',
      }),
    },
    usageMealCardQuery: {
      dependencies: ['@time', 'bestUser'],
      factory: (time, bestUser) => Promise.resolve({
        time, bestUser, measure: 'CardBalance',
      }),
    },
    usageMealCardBucketCB: {
      dependencies: ['@time', 'bestUser'],
      factory: (time, bestUser) => Promise.resolve({
        time, bestUser, measure: 'CardBalance',
      }),
    },
    revenue: { // from here to test chart with real data
      dependencies: ['@time'],
      factory: time => fetchData({
        parameters: {
          BranchName: {
            type: 'enum',
            values: ['AllUp'],
          },
          CardType: {
            type: 'enum',
            values: ['员工卡', '访客卡'],
          },
          MealName: {
            type: 'enum',
            values: ['午餐', '早餐'],
          },
          SKUType: {
            type: 'enum',
            values: ['AllUp'],
          },
          time: {
            type: 'range',
            values: time,
          },
        },
        metric: '169feb7a-c332-4979-9c6a-377bf2d75152',
      }),
    },
    formatRevenue2Line: {
      dependencies: ['revenue'],
      factory: revenue => convertData({
        ...revenue,
        groupDimensions: ['BranchName', 'MealName', 'SKUType', 'CardType'],
        axisDimensions: ['time'],
        metricDimensions: ['169feb7a-c332-4979-9c6a-377bf2d75152'],
        serieNameTemplate: 'BranchName({{BranchName}});MealName({{MealName}});SKUType({{SKUType}});CardType({{CardType}})',
      }),
    },
    top3Revenue: {
      dependencies: ['formatRevenue2Line'],
      factory: ({ source, seriesMapper }) => topNData({
        take: 3,
        metric: '169feb7a-c332-4979-9c6a-377bf2d75152',
        axisDimensions: ['time'],
        source,
        seriesMapper,
      }),
    },
  },
  id: '10000',
};
