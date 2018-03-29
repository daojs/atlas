// import Promise from 'bluebird';
<<<<<<< HEAD
// import _ from 'lodash';
import client from '../../mock/worker';
=======
import _ from 'lodash';
// import client from '../mock/worker';
>>>>>>> e144d202c3ef3dac2e03345f525d2ec2483a3908

// dags
import factories from '../../factories';
import branch from '../branch.json';
import category from '../category.json';

const {
  fetchMasterKongRevenueGapPerBranchMonth,
} = factories;

const simulation = client.call('masterKongSimulate');

export default {
  parameters: {
    time: { default: { start: '2018-01-01', end: '2018-02-01' } },
  },
  cells: {
<<<<<<< HEAD
    catory: {
      factory: () => Promise.resolve({
        defaultValue: '冰茶',
        enums: [
          '冰茶',
          '劲凉冰茶',
          '绿茶',
          '乌龙茗茶',
          '茉莉茶',
          '康师傅果汁',
          '传世清饮',
          '每日C果汁',
          '康师傅包装水',
          '水漾',
          '经典奶茶',
          '冰糖系列',
          '本味茶庄',
          '饮养奶咖',
          '轻养果荟',
          '乳酸菌',
          '一刻馆',
          '其他',
          '铁观音',
        ],
      }),
    },
    branch: {
      factory: () => Promise.resolve({
        defaultValue: '独立用户数',
        enums: [
          '江西',
          '湖北',
          '重庆',
          '珠三角',
          '广西',
          '海南',
          '福建',
          '江苏',
        ],
      }),
    },
    masterKongOverallRevenueAndVolumnTrend: {
      factory: fetchMasterKongRevenueAndVolumnTrend(),
=======
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
>>>>>>> e144d202c3ef3dac2e03345f525d2ec2483a3908
    },
    revenueBreakDownByTime: {
      dependencies: ['@catory', '@branch'],
      factory: fetchMasterKongRevenueBreakDownByTime(),
    },
  },
  id: '10000',
};
