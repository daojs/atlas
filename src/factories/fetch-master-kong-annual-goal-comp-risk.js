import axios from 'axios';
import _ from 'lodash';

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
  }).then(({ data }) => data.data)
    .then(data => _.map(data, value => _.extend(value, {
      target: Math.round(value.target / 1000000) / 100,
      forecast: Math.round(value.forecast / 1000000) / 100,
    })))
    .then(data => _.filter(data, row => !_.includes(['Jan', 'Feb', 'Mar'], row.month)))
}
