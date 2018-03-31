import _ from 'lodash';
// import axios from 'axios';

// export default function () {
//   return () => axios.post('./insight', {
//     '@target': 'master-kong',
//     '@proc': 'query',
//     '@args': [
//       'VolumeTSAD',
//       {
//         aggregation: {
//           Value: 'sum',
//           ExpectedValue: 'sum',
//         },
//         filter: {
//           Timetamp: {
//             type: 'time-range',
//             from: '2017-01-01T00:00:00Z',
//             to: '2017-12-31T23:59:59Z',
//           },
//         },
//         groupBy: {
//           Timestamp: 'week',
//         },
//       },
//     ],
//   })
//     .tap(console.log)
//     .then(({ data }) => data.data)
//     .then(values => _.map(values, value => _.extend(value, {
//       Delta: value.Value - value.ExpectedValue,
//     })));
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
      }, 'result').then(values => _.map(values, value => _.extend(value, {
        Delta: value.Value - value.ExpectedValue,
      })));

      return ret;
    });
}
