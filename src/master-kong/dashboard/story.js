// import Promise from 'bluebird';
// import _ from 'lodash';
// import client from '../mock/worker';

// dags
import factories from '../../factories';

// const {
//   fetchMasterKongRevenueAndVolumnTrend,
// } = factories;

export default {
  parameters: {
    time: { default: { start: '2018-01-01', end: '2018-02-01' } },
  },
  cells: {
    // masterKongOverallRevenueAndVolumnTrend: {
    //   factory: fetchMasterKongRevenueAndVolumnTrend(),
    // },
  },
  id: '20001',
};
