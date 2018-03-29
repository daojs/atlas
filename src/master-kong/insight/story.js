// import Promise from 'bluebird';
import _ from 'lodash';
import client from '../../mock/worker';

// dags
import factories from '../../factories';
import branch from '../branch.json';
import category from '../category.json';

const {
  fetchMasterKongRevenueGap,
} = factories;

const simulation = client.call('simulateMasterKong');

export default {
  parameters: {
    time: { default: { start: '2018-01-01', end: '2018-02-01' } },
    branch: { default: undefined },
    category: { default: undefined },
  },
  cells: {
    // fetchMasterKongRevenueGapPerBranchMonth: {
    //   factory: fetchMasterKongRevenueGapPerBranchMonth(),
    // },
    // masterKongRevenueGapPerBranchMonth: {
    //   dependencies: ['fetchMasterKongRevenueGapPerBranchMonth'],
    //   factory: (rawData) => {
    //     if (_.some([rawData], _.isNil)) {
    //       return undefined;
    //     }

    //     return Promise.resolve({
    //       source: rawData,
    //       metricDimensions: ['gap'],
    //     });
    //   },
    // },
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
    fetchRevenueGapPerCategory: {
      dependencies: ['@branch'],
      factory: fetchMasterKongRevenueGap(client, simulation, {
        metric: 'branch',
        otherMetric: 'category',
      }),
    },
    revenueGapPerCategory: {
      dependencies: ['fetchRevenueGapPerCategory'],
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
    fetchRevenueGapPerBranch: {
      dependencies: ['@category'],
      factory: fetchMasterKongRevenueGap(client, simulation, {
        metric: 'category',
        otherMetric: 'branch',
      }),
    },
    revenueGapPerBranch: {
      dependencies: ['fetchRevenueGapPerBranch'],
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
