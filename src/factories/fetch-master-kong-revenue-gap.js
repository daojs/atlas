import _ from 'lodash';

export default function (client, simulation, { metric, otherMetric }) {
  return (filter) => {
    if (_.some([filter], _.isNil)) {
      return Promise.resolve();
    }

    return simulation
      .then(({ revenueGap }) => client.call('dag', {
        revenueGapData: {
          '@proc': 'read',
          '@args': [
            revenueGap,
          ],
        },
        result: {
          '@proc': 'query2',
          '@args': [{
            '@ref': 'revenueGapData',
          }, {
            aggregation: {
              gap: 'sum',
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
