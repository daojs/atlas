import _ from 'lodash';

export default function (client, simulation) {
  return (category) => {
    if (_.some([category], _.isNil)) {
      return Promise.resolve({ data: [] });
    }

    return simulation
      .then(data => client.call('dag', {
        transactionData: {
          '@proc': 'read',
          '@args': [
            data,
          ],
        },
        result: {
          '@proc': 'query2',
          '@args': [{
            '@ref': 'transactionData',
          }, {
            aggregation: {
              targetRevenue: 'sum',
              forcastRevenue: 'sum',
            },
            filter: {
              category,
            },
            groupBy: {
              month: 'value',
            },
          }],
        },
      }, 'result')).then(_.tap(window.console.log));
  };
}
