import _ from 'lodash';

export default function (client, simulation, { metric, otherMetric }) {
  return (filter) => {
    if (_.some([filter], _.isNil)) {
      return Promise.resolve();
    }

    return simulation
      .then(({ forecast }) => client.call('dag', {
        revenueGapData: {
          '@proc': 'read',
          '@args': [
            forecast,
          ],
        },
        result: {
          '@proc': 'query2',
          '@args': [{
            '@ref': 'revenueGapData',
          }, {
            aggregation: {
              销售指标差距: 'sum',
            },
            filter: {
              [metric]: filter,
            },
            groupBy: {
              month: 'value',
              [otherMetric]: 'value',
            },
          }],
        },
      }, 'result'));
  };
}
