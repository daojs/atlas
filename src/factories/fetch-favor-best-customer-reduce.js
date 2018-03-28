import _ from 'lodash';
import axios from 'axios';

export default function (client, simulation, { metricsDictionary, groupByDictionary }) {
  return (time, measure, dimension, bestUser) => {
    if (_.some([time, measure, dimension, bestUser], _.isNil)) {
      return Promise.resolve({ data: [] });
    }

    const aggregation = metricsDictionary[measure];

    return axios.post('./insight', {
      '@proc': 'query',
      '@args': [
        'Transaction',
        {
          aggregation,
          filter: {
            timestamp: {
              type: 'time-range',
              from: time.start,
              to: time.end,
            },
          },
          groupBy: {
            [groupByDictionary[dimension]]: 'value',
          },
        },
      ],
    });

    // return simulation
    //   .then(({ transaction }) => client.call('dag', {
    //     transactionData: {
    //       '@proc': 'read',
    //       '@args': [
    //         transaction,
    //       ],
    //     },
    //     result: {
    //       '@proc': 'query2',
    //       '@args': [{
    //         '@ref': 'transactionData',
    //       }, {
    //         aggregation,
    //         filter: {
    //           timestamp: {
    //             type: 'time-range',
    //             from: time.start,
    //             to: time.end,
    //           },
    //           ...bestUser,
    //         },
    //         groupBy: {
    //           [groupByDictionary[dimension]]: 'value',
    //         },
    //       }],
    //     },
    //   }, 'result'));
  };
}
