import Promise from 'bluebird';
import _ from 'lodash';
import client from '../mock/worker';

// dags
import factories from '../factories';

const {
  fetchMetricTrend,
  fetchRevenueForecast,
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
    granularity: { default: undefined },
    mealName: { default: undefined },
    branch: { default: undefined },
  },
  cells: {
    mealName: {
      factory: () => Promise.resolve({
        defaultValue: '午餐',
        enums: ['午餐', '早餐', '晚餐'],
      }),
    },
    branch: {
      factory: () => Promise.resolve({
        defaultValue: '员工餐厅',
        enums: ['员工餐厅', '北京小院', '咖啡厅', '咖喱屋', '意大利餐厅', '粤菜餐厅', '自助餐厅', '西餐厅'],
      }),
    },
    granularity: {
      factory: () => Promise.resolve({
        defaultValue: 'week',
        enums: ['week', 'month'],
      }),
    },
    fetchMetricTrend: {
      dependencies: ['@time'],
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
    usageMetricTrend: {
      dependencies: ['fetchMetricTrend'],
      factory: ({ data }) => Promise.resolve({
        source: data,
        axisDimensions: ['timestamp'],
      }),
    },
    fetchRevenueForecastByMeal: {
      dependencies: ['@mealName'],
      factory: fetchRevenueForecast(
        client,
        simulation,
        {
          metricsDictionary,
          dimensionsDictionary,
          groupByDictionary,
        },
      ),
    },
    usageRevenueForecastByMeal: {
      dependencies: ['fetchRevenueForecastByMeal'],
      factory: ({ data }) => Promise.resolve({
        source: data,
        axisDimensions: ['timestamp'],
      }),
    },
    fetchRevenueForecastByBranch: {
      dependencies: ['@time'],
      factory: fetchRevenueForecast(
        client,
        simulation,
        {
          metricsDictionary,
          dimensionsDictionary,
          groupByDictionary,
        },
      ),
    },
    usageRevenueForecastByBranch: {
      dependencies: ['fetchRevenueForecastByBranch'],
      factory: ({ data }) => Promise.resolve({
        source: data,
        axisDimensions: ['timestamp'],
      }),
    },
  },
  id: '10002',
};
