import _ from 'lodash';

export default function (client, simulation, { metricsDictionary }) {
  return (time, measure, bestUser) => {
    if (_.some([time, measure, bestUser], _.isNil)) {
      return Promise.resolve([]);
    }

    const aggregation = metricsDictionary[measure];

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
            aggregation,
            filter: {
              timestamp: {
                type: 'time-range',
                from: time.start,
                to: time.end,
              },
              ...bestUser,
            },
            groupBy: {
              timestamp: {
                type: 'time-bin',
                step: 'PT10M',
              },
            },
          }],
        },
        result: {
          '@proc': 'query2',
          '@args': [{
            '@ref': 'step1',
          }, {
            aggregation: {
              [_.keys(aggregation)[0]]: 'average',
            },
            groupBy: {
              timestamp: {
                type: 'time-phase',
                step: 'P1D',
              },
            },
          }],
        },
      }, 'result'));
  };
}
