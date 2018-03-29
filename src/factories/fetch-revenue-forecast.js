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
            timestamp: 'day',
            [groupByDictionary[dimension]]: 'value',
          },
        },
      ],
    });
  };
}
