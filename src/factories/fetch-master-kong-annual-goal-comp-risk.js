import _ from 'lodash';

export default function (client, simulation, { aggregation }) {
  return () => simulation
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
          aggregation,
          groupBy: {
            month: 'value',
          },
        }],
      },
    }, 'result'));
}
