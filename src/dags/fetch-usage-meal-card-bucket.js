export default function (client, simulation) {
  return (time, bestUser) => simulation
    .then(({ recharge }) => client.call('query', recharge, {
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
    }))
    .then(id => client.call('query', id, {
      aggregation: {
        customerId: 'count',
      },
      groupBy: {
        rechargeAmount: {
          type: 'bin',
          step: 200,
        },
      },
    }).finally(() => client.call('remove', id)))
    .then(id => client.call('read', id).finally(() => client.call('remove', id)));
}
