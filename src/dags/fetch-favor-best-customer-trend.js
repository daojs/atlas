import _ from 'lodash';

export default function (client, simulation, { metricsDictionary, groupByDictionary }) {
  return (time, measure, dimension, bestUser) => {
    if (_.some([time, measure, dimension, bestUser], _.isNil)) {
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
        result: {
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
              timestamp: 'day',
              [groupByDictionary[dimension]]: 'value',
            },
          }],
        },
      }, 'result'));
  };
}
