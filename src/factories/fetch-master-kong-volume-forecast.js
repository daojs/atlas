import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';

export default function () {
  return (filter) => {
    if (_.some([filter], _.isNil)) {
      return Promise.resolve();
    }

    return axios.post('/insight', {
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
    }).then(({ data }) => _.map(data.data, item => _.extend(item, {
      timestamp: moment(item.timestamp).format('YYYY-MM'),
    })));
  };
}

