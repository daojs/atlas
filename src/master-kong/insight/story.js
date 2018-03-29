// import Promise from 'bluebird';
import _ from 'lodash';
// import client from '../mock/worker';

// dags
import factories from '../../factories';
import branch from '../branch.json';
import category from '../category.json';

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
    branch: {
      factory: () => Promise.resolve({
        defaultValue: '江西',
        enums: branch,
      }),
    },
    category: {
      factory: () => Promise.resolve({
        defaultValue: '冰茶',
        enums: category,
      }),
    },
  },
  id: '10000',
};
