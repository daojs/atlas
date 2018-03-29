export default function (client, simulation) {
  return (time, bestUser) => simulation
    .then(({ recharge }) => client.call('dag', {
      rechargeData: {
        '@proc': 'read',
        '@args': [
          recharge,
        ],
      },
      sumByTime: {
        '@proc': 'query2',
        '@args': [{
          '@ref': 'rechargeData',
        }, {
          aggregation: {
            rechargeAmount: 'sum',
          },
          filter: {
            timestamp: {
              type: 'time-range',
              from: time.start,
              to: time.end,
            },
            ...bestUser,
          },
          groupBy: {
            customerId: 'value',
          },
        }],
      },
      result: {
        '@proc': 'query2',
        '@args': [{
          '@ref': 'sumByTime',
        }, {
          aggregation: {
            customerId: 'count',
          },
          groupBy: {
            rechargeAmount: {
              type: 'bin',
              step: 200,
            },
          },
        }],
      },
    }, 'result'));
}
