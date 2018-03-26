import _ from 'lodash';

export default function (client, simulation) {
  return (time, aggregation, bestUser) => {
    if (_.some([time, aggregation, bestUser], _.isNil)) {
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
            },
          }],
        },
      }, 'result'));
  };
}
