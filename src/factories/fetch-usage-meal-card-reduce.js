import _ from 'lodash';
import axios from 'axios';

export default function () {
  return (time, bestUser) => {
    if (_.some([time, bestUser], _.isNil)) {
      return Promise.resolve({ data: [] });
    }

    return axios.post('./insight', {
      '@proc': 'query',
      '@args': [
        'Transaction',
        {
          aggregation: {
            customerId: 'count',
          },
          filter: {
            timestamp: {
              type: 'time-range',
              from: time.start,
              to: time.end,
            },
          },
          groupBy: {
            cardType: 'value',
          },
        },
      ],
    });
  };
}
