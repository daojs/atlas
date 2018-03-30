import _ from 'lodash';

export default function (client, simulation) {
  return (filter) => {
    if (_.some([filter], _.isNil)) {
      return Promise.resolve();
    }

    return simulation
      .then(({ forecastv2 }) => {
        const ret = client.call('dag', {
          revenueForecast: {
            '@proc': 'read',
            '@args': [
              forecastv2,
            ],
          },
          result: {
            '@proc': 'query2',
            '@args': [{
              '@ref': 'revenueForecast',
            }, {
              aggregation: {
                target: 'sum',
                forecast: 'sum',
                mape: 'average',
                ape: 'average',
              },
              groupBy: {
                timestamp: 'value',
              },
            }],
          },
        }, 'result');

        return ret;
      });
  };
}

