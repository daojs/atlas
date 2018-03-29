// import Promise from 'bluebird';
import _ from 'lodash';
// import client from '../mock/worker';

// dags
import factories from '../../factories';

const {
  fetchMasterKongRevenueGapPerBranchMonth,
} = factories;

export default {
  parameters: {
    time: { default: { start: '2018-01-01', end: '2018-02-01' } },
  },
  cells: {
    fetchMasterKongRevenueGapPerBranchMonth: {
      factory: fetchMasterKongRevenueGapPerBranchMonth(),
    },
    masterKongRevenueGapPerBranchMonth: {
      dependencies: ['fetchMasterKongRevenueGapPerBranchMonth'],
      factory: (rawData) => {
        if (_.some([rawData], _.isNil)) {
          return undefined;
        }

        return Promise.resolve({
          source: rawData,
          metricDimensions: ['gap'],
        });
      },
    },
  },
  id: '10000',
};
