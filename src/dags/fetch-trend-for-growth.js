import _ from 'lodash';

export default function (client, simulation, { metricsDictionary }) {
  return (time, measure, bestUser) => {
    if (_.some([time, measure, bestUser], _.isNil)) {
      return Promise.resolve([]);
    }

    const aggregation = metricsDictionary[measure];

    return simulation
      .then(({ transaction }) => client.call('query', transaction, {
        aggregation,
        filter: {
          timestamp: {
            type: 'time-range',
            from: time.start,
            to: time.end,
          },
          ...bestUser,
        },
        groupBy: {
          timestamp: 'day',
        },
      }))
      .then(id => client.call('read', id).finally(() => client.call('remove', id)));
  };
}
