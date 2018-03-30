import axios from 'axios';

export default function () {
  return () => axios.post('./insight', {
    '@target': 'master-kong',
    '@proc': 'query',
    '@args': [
      'Revenue',
      {
        aggregation: {
          target: 'sum',
          forecast: 'sum',
        },
        filter: {
          year: '17',
        },
        groupBy: {
          timestamp: 'month',
        },
      },
    ],
  });
}
