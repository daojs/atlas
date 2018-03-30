import _ from 'lodash';

export default function (client, simulation, key) {
  return (keyValue) => {
    if (_.some([keyValue], _.isNil)) {
      return Promise.resolve({ data: [] });
    }

    return simulation

      .then(({ forecast }) => client.call('dag', {
        forecastData: {
          '@proc': 'read',
          '@args': [
            forecast,
          ],
        },
        result: {
          '@proc': 'query2',
          '@args': [{
            '@ref': 'forecastData',
          }, {
            aggregation: {
              目标销量: 'sum',
              预测销量: 'sum',
            },
            filter: {
              [key]: keyValue,
            },
            groupBy: {
              month: 'value',
            },
          }],
        },
      }, 'result'));
  };
}
