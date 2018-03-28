import _ from 'lodash';
import axios from 'axios';

export default function () {
  return (time, aggregation, bestUser) => {
    if (_.some([time, aggregation, bestUser], _.isNil)) {
      return Promise.resolve([]);
    }

    return axios.post('/insight', {
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
    }).then(({ data }) => data);
  };
}
