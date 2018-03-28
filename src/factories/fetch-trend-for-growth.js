import _ from 'lodash';
import axios from 'axios';

export default function (client, simulation, { metricsDictionary }) {
  return (time, measure, bestUser) => {
    if (_.some([time, measure, bestUser], _.isNil)) {
      return Promise.resolve([]);
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
            timestamp: 'day',
          },
        },
      ],
    });
  };
}
