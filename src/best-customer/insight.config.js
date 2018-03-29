import Promise from 'bluebird';
import _ from 'lodash';
import client from '../mock/worker';

// dags
import factories from '../factories';

const {
  fetchMetricTrend,
  fetchGoalBreakDown,
  fetchGoalAchieve,
} = factories;

const metricsDictionary = {
  利润: { revenue: 'sum' },
  独立用户数: { customerId: 'count' },
  交易笔数: { transactionId: 'count' },
};

const dimensionsDictionary = {
  餐厅名称: {
    Branch: { type: 'any' },
  },
  餐卡类别: {
    cardType: { type: 'any' },
  },
  菜品类别: {
    SKU: { type: 'any' },
  },
};

const groupByDictionary = {
  餐厅名称: 'Branch',
  餐卡类别: 'cardType',
  菜品类别: 'SKU',
};

const simulation = client.call('simulate', {
  startDate: '2018-01-01',
  endDate: '2018-03-31',
  customerCount: 200,
});

export default {
  parameters: {
    time: { default: { start: '2018-01-01', end: '2018-02-01' } },
    metric: { default: undefined },
    granularity: { default: undefined },
    dimension: { default: undefined },
    branch: { default: undefined },
  },
  cells: {
    metric: {
      factory: () => Promise.resolve({
        defaultValue: '利润',
        enums: ['利润', '独立用户数', '交易笔数'],
      }),
    },
    granularity: {
      factory: () => Promise.resolve({
        defaultValue: 'week',
        enums: ['week', 'month'],
      }),
    },
    dimension: {
      factory: () => Promise.resolve({
        defaultValue: '餐厅名称',
        enums: ['餐厅名称', '餐卡类别', '菜品类别'],
      }),
    },
    fetchMetricTrend: {
      dependencies: ['@time', '@metric', '@dimension', '@granularity'],
      factory: fetchMetricTrend(
        client,
        simulation,
        {
          metricsDictionary,
          dimensionsDictionary,
          groupByDictionary,
        },
      ),
    },
    metricCumulative: {
      dependencies: ['fetchMetricTrend', '@metric'],
      factory: (rawData, metric) => {
        if (_.some([rawData], _.isNil)) {
          return undefined;
        }
        return Promise.resolve({
          source: [],
          metric,
          axisDimensions: ['timestamp'],
        });
      },
    },
    // goal breakdown
    fetchGoalBreakDown: {
      dependencies: ['@time', '@dimension', '@granularity'],
      factory: fetchGoalBreakDown(
        client,
        simulation,
        {
          metricsDictionary,
          dimensionsDictionary,
          groupByDictionary,
        },
      ),
    },
    usageGoalBreakDown: {
      dependencies: ['fetchGoalBreakDown'],
      factory: data => Promise.resolve({
        source: data,
      }),
    },
    // goal achieve
    fetchGoalAchieve: {
      dependencies: ['@time', '@dimension', '@granularity'],
      factory: fetchGoalAchieve(
        client,
        simulation,
        {
          metricsDictionary,
          dimensionsDictionary,
          groupByDictionary,
        },
      ),
    },
    usageGoalAchieve: {
      dependencies: ['fetchGoalAchieve'],
      factory: data => Promise.resolve({
        source: data,
      }),
    },
  },
  id: '20000',
};
