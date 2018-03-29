import axios from 'axios';

export default function ({ filter } = {}) {
  return () => axios.post('./insight', {
    '@proc': 'query',
    '@target': 'master-kong',
    '@args': [
      'Transaction',
      {
        aggregation: {
          revenue: 'sum',
          volumn: 'sum',
        },
        filter,
        groupBy: {
          timestamp: 'value',
        },
      },
    ],
  });
}
