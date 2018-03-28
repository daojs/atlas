import _ from 'lodash';
import axios from 'axios';

export default (time, bestUser) => {
  if (_.some([time, bestUser], _.isNil)) {
    return Promise.resolve([]);
  }

  return axios.post('/insight', {
    '@proc': 'retention',
    '@args': [
      {
        // aggregation,
        filter: {
          timestamp: {
            type: 'time-range',
            from: time.start,
            to: time.end,
          },
          ...bestUser,
        },
        // groupBy: {
        //   timestamp: 'day',
        // },
      },
      {
        granularity: 'day',
      },
    ],
  }).then(({ data }) => data);
};
