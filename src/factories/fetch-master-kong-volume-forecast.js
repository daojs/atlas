import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';

export default function () {
  return () => axios.post('./insight', {
    '@target': 'master-kong',
    '@proc': 'query',
    '@args': [
      'Volume',
      {
        aggregation: {
          target: 'sum',
          forecast: 'sum',
          mape: 'average',
          ape: 'average',
        },
        groupBy: {
          timestamp: 'month',
        },
      },
    ],
  }).then((response) => {
    const data = _.map(response.data.data, (item) => {
      const ret = {
        timestamp: moment(item.timestamp).format('YYYY-MM'),
        forecast: item.forecast !== null ? item.forecast.toFixed(2) : null,
        target: item.target !== null ? item.target.toFixed(2) : null,
        ape: item.ape !== '' ? (parseFloat(item.ape, 10) * 100).toFixed(2) : null,
        mape: item.mape !== '' ? (parseFloat(item.mape, 10) * 100).toFixed(2) : null,
      };
      return ret;
    });

    return data;
  });
}
