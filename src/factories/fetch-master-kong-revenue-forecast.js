// import axios from 'axios';
// 
// export default function () {
//   return () => axios.post('./insight', {
//     '@proc': 'query',
//     '@target': 'master-kong',
//     '@args': [
//       'Transaction',
//       {
//         aggregation: {
//           target: 'sum',
//           forecast: 'sum',
//         },
//         groupBy: {
//           timestamp: 'value',
//         },
//       },
//     ],
//   });
// }

import axios from 'axios';
import _ from 'lodash';

export default function () {
  return () => axios.post('./insight', {
    '@target': 'master-kong',
    '@proc': 'query',
    '@args': [
      'Volume',
      {
        aggregation: {
          target: 'sum',
          forecast: 'sum',
          mape: 'average',
          ape: 'average',
        },
        groupBy: {
          timestamp: 'month',
        },
      },
    ],
  }).then((response) => {
    const data = _.map(response.data.data, (item) => {
      const ret = {
        timestamp: item.timestamp.slice(0, 7),
        forecast: item.forecast !== null ? item.forecast.toFixed(2) : null,
        target: item.target !== null ? item.target.toFixed(2) : null,
        // ape: item.ape !== '' ? (parseFloat(item.ape, 10) * 100).toFixed(2) : null,
        // mape: item.mape !== '' ? (parseFloat(item.mape, 10) * 100).toFixed(2) : null,
      };
      return ret;
    });

    return data;
  });
}


/*
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

*/
