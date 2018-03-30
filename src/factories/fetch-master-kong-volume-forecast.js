import _ from 'lodash';
import axios from 'axios';

export default function () {
  return (filter) => {
    if (_.some([filter], _.isNil)) {
      return Promise.resolve();
    }

    return axios.post('./insight', {
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
            timestamp: 'value',
          },
        },
      ],
    });
  };
}

