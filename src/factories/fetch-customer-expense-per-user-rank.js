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
        stepFilter: {
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
              customerId: 'value',
            },
          }],
        },
        result: {
          '@proc': 'query2',
          '@args': [{
            '@ref': 'stepFilter',
          }, {
            aggregation: {
              revenue: 'average',
            },
            groupBy: {
              customerId: 'value',
            },
            orderBy: ['-revenue'],
            top: 10,
          }],
        },
      }, 'result'));
  };
}
