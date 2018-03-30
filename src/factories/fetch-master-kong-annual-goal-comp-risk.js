import axios from 'axios';

export default function ({ metricKey }) {
  return () => axios.post('./insight', {
    '@target': 'master-kong',
    '@proc': 'query',
    '@args': [
      metricKey, {
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
      }],
  }).then(result => result.data);
}
