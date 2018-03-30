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
        },
        groupBy: {
          timestamp: 'value',
        },
      },
    ],
  }).then((response) => {
    console.log(response);
    return response.data.data;
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
