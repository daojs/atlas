import _ from 'lodash';
import { Loader } from 'calculation-network';
import { dag } from './dag-ql-test';
import story from './test-story.yaml';

console.log(story);

// export const storyGraph = new CalculationNetwork({
//   time: {
//     factory: () => ({
//       start: '2018-01-01',
//       end: '2018-02-01',
//     }),
//   },
//   measureUser: {
//     factory: () => ({
//       defaultValue: '独立用户数',
//       enums: ['利润', '独立用户数', '交易笔数'],
//     }),
//   },
//   bestUser: {
//     dependencies: ['@measureUser', '@time'],
//     factory: () => ({ department: 'STC', discipline: 'SDE' }),
//   },
//   measureCustomer: {
//     factory: () => ({
//       defaultValue: '独立用户数',
//       enums: ['利润', '独立用户数', '交易笔数'],
//     }),
//   },
//   bestCustomerQuery: {
//     dependencies: ['@time', '@measureCustomer', 'bestUser'],
//     factory: result => ({
//       time: result['@time'],
//       measureCustomer: result['@measureCustomer'],
//       bestUser: result.bestUser,
//     }),
//   },
//   mapCustomerMetric: {
//     dependencies: ['@measureCustomer'],
//     factory: (result) => { //eslint-disable-line
//       return ({
//         利润: { revenue: 'sum' },
//         独立用户数: { customerId: 'count' },
//         交易笔数: { transactionId: 'count' },
//       }[result['@measureCustomer']]);
//     },
//   },
//   fetchCustomerTSAD: {
//     dependencies: ['@time', 'mapCustomerMetric', 'bestUser'],
//     factory: ({ '@time': time, mapCustomerMetric, bestUser }) => {
//       if (_.some([time, mapCustomerMetric, bestUser], _.isNil)) {
//         return [];
//       }

//       return dag({
//         simulate: {
//           '@proc': 'simulateRecharge',
//           '@args': [{
//             startDate: '2018-01-01',
//             endDate: '2018-03-31',
//             customerCount: 200,
//           }],
//         },
//         transactionData: {
//           '@proc': 'read',
//           '@args': [{
//             '@ref': 'simulate',
//           }],
//         },
//         result: {
//           '@proc': 'query2',
//           '@args': [{
//             '@ref': 'transactionData',
//           }, {
//             aggregation: mapCustomerMetric,
//             filter: {
//               timestamp: {
//                 type: 'time-range',
//                 from: time.start,
//                 to: time.end,
//               },
//               ...bestUser,
//             },
//             groupBy: {
//               timestamp: 'day',
//             },
//           }],
//         },
//       }, 'result');
//     },
//   },
//   bestCustomerTSAD: {
//     dependencies: ['fetchCustomerTSAD', 'mapCustomerMetric', 'bestUser'],
//     factory: ({ fetchCustomerTSAD, mapCustomerMetric, bestUser }) => {
//       if (_.some([fetchCustomerTSAD, mapCustomerMetric, bestUser], _.isNil)) {
//         return undefined;
//       }
//       return {
//         source: fetchCustomerTSAD,
//         axisDimensions: ['timestamp'],
//         metricDimensions: _.keys(mapCustomerMetric),
//       };
//     },
//   },
// });
