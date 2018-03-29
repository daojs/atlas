import _ from 'lodash';

export default function (client, simulation) {
  return (category) => {
    if (_.some([category], _.isNil)) {
      return Promise.resolve({ data: [] });
    }

    return simulation

      .then(({ forcast }) => client.call('dag', {
        forcastData: {
          '@proc': 'read',
          '@args': [
            forcast,
          ],
        },
        result: {
          '@proc': 'query2',
          '@args': [{
            '@ref': 'forcastData',
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
      }, 'result'));
  };
}
