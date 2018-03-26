export default function (client, simulation) {
  return (time, bestUser) => simulation
    .then(({ recharge }) => client.call('query', recharge, {
      aggregation: {
        customerId: 'count',
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
        cardType: 'value',
      },
    }))
    .then(id => client.call('read', id).finally(() => client.call('remove', id)));
}
