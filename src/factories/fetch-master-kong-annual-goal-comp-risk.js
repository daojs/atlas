import axios from 'axios';

export default function ({ aggregation, metricKey }) {
  return () => axios.post('./insight', {
    '@target': 'master-kong',
    '@proc': 'query',
    '@args': [
      metricKey, {
        aggregation,
        filter: {
          year: '17',
        },
        groupBy: {
          timestamp: 'month',
        },
      }],
  });
}
