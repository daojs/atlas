import _ from 'lodash';

export default function (client, simulation, key) {
  return (keyValue) => {
    if (_.some([keyValue], _.isNil)) {
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
              targetVolume: 'sum',
              forcastVolume: 'sum',
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
