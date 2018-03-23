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
    fetchCustomerExpensePerUserRank: {
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
          .then(id => client.call('read', id).finally(() => client.call('remove', id)));
      },
    },
    customerExpensePerUserRank: {
      dependencies: ['fetchCustomerExpensePerUserRank'],
      factory: data => Promise.resolve({
        data,
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

    // Section 4
    fetchUsageMealCardReduce: {
      dependencies: ['@time', 'bestUser'],
      factory: (time, bestUser) => simulation
        .then(({ recharge }) => client.call('reduce', recharge, {
          metrics: {
            customerId: 'count',
          },
          dimensions: _.defaults({
            cardType: { type: 'any' },
            timestamp: {
              type: 'time',
              from: time.start,
              to: time.end,
            },
          }, bestUser),
        }))
        .then(id => client.call('read', id).finally(() => client.call('remove', id)))
        .tap(window.console.log),
    },
    usageMealCardReduce: {
      dependencies: ['fetchUsageMealCardReduce'],
      factory: data => Promise.resolve({
        title: `共有${_.sum(_.map(data, 'customerId'))}人充值`,
        source: [['name', 'value']].concat(_.map(data, item => [item.cardType, item.customerId])),
      }).tap(window.console.log),
    },
    fetchUsageMealCardBucketCRAP: {
      dependencies: ['@time', 'bestUser'],
      factory: (time, bestUser) => simulation
        .then(({ recharge }) => client.call('reduce', recharge, {
          metrics: {
            rechargeAmount: 'sum',
          },
          dimensions: _.defaults({
            customerId: { type: 'any' },
            timestamp: {
              type: 'time',
              from: time.start,
              to: time.end,
            },
          }, bestUser),
        }))
        .then(id => client.call('reduce', id, {
          metrics: {
            customerId: 'count',
          },
          dimensions: {
            rechargeAmount: {
              type: 'bins',
              step: 200,
            },
          },
        }).finally(() => client.call('remove', id)))
        .then(id => client.call('read', id).finally(() => client.call('remove', id)))
        .tap(window.console.log),
    },
    usageMealCardBucketCRAP: {
      dependencies: ['fetchUsageMealCardBucketCRAP'],
      factory: data => Promise.resolve({
        title: '',
        source: [['name', 'value']].concat(_.map(data, item => [item.rechargeAmount, item.customerId])),
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
  },
  id: '10000',
};
