import _ from 'lodash';
import string2GranularityMap from './enum';

export default function (client, simulation) {
  return (time, granularityString, bestUser) => {
    const granularity = string2GranularityMap[granularityString];

    if (_.some([time, granularity, bestUser], _.isNil)) {
      return Promise.resolve([]);
    }

    return simulation
      .then(({ transaction }) => client.call('dag', {
        transactionData: {
          '@proc': 'read',
          '@args': [
            transaction,
          ],
        },
        step1: {
          '@proc': 'query2',
          '@args': [{
            '@ref': 'transactionData',
          }, {
            aggregation: {
              revenue: 'sum',
            },
            filter: {
              timestamp: {
                type: 'time-range',
                from: time.start,
                to: time.end,
              },
              ...bestUser,
            },
            groupBy: {
              timestamp: granularity,
              customerId: 'value',
            },
          }],
        },
        step2: {
          '@proc': 'query2',
          '@args': [{
            '@ref': 'step1',
          }, {
            aggregation: {
              revenue: 'average',
            },
            groupBy: {
              customerId: 'value',
            },
          }],
        },
        result: {
          '@proc': 'query2',
          '@args': [{
            '@ref': 'step2',
          }, {
            aggregation: {
              customerId: 'count',
            },
            groupBy: {
              revenue: {
                type: 'bin',
                step: 10,
              },
            },
          }],
        },
      }, 'result'));
  };
}
