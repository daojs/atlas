import axios from 'axios';

// export default function () {
//   return () => axios.post('./insight', {
//     '@target': 'master-kong',
//     '@proc': 'query',
//     '@args': [
//       'Volume',
//       {
//         aggregation: {
//           target: 'sum',
//           forecast: 'sum',
//         },
//         filter: {
//           year: '17',
//         },
//         groupBy: {
//           timestamp: 'month',
//         },
//       },
//     ],
//   }).then((response) => {
//     console.log(response);
//     return response.data.data;
//   });
// }

export default function (client, simulation) {
  return () => simulation
    .then(({ salesCountTSAD }) => {
      const ret = client.call('dag', {
        salesCountTSAD: {
          '@proc': 'read',
          '@args': [
            salesCountTSAD,
          ],
        },
        result: {
          '@proc': 'query2',
          '@args': [{
            '@ref': 'salesCountTSAD',
          }, {
            aggregation: {
              Value: 'sum',
              ExpectedValue: 'sum',
            },
            filter: {
              Timetamp: {
                type: 'time-range',
                from: '2017-01-01T00:00:00Z',
                to: '2017-12-31T23:59:59Z',
              },
            },
            groupBy: {
              Timetamp: 'week',
            },
          }],
        },
      }, 'result');

      console.log(ret);
      return ret;
    });
}
