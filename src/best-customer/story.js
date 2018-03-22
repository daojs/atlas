import Promise from 'bluebird';
import { fetchData, convertData, topNData } from '../transforms';

export default {
  parameters: {
    measureUser: { default: undefined },
    time: { default: { start: '2017-11-01', end: '2017-12-02' } },
    measureCustomer: { default: undefined },
    granularityCustomer: { default: undefined },
    measureFavor: { default: undefined },
    dimensionFavor: { default: undefined },
  },
  cells: {
    measureUser: {
      factory: () => Promise.resolve({
        defaultValue: 'UU',
        enums: ['Revenue', 'UU', 'TransactionCount'],
      }),
    },
    bestUser: {
      dependencies: ['@measureUser', '@time'],
      factory: (measureUser, time) => Promise.resolve({ data: { data: { Department: 'STC', Discipline: 'DEV' }, metric: measureUser, time } }),
    },
    measureCustomer: {
      factory: () => Promise.resolve({
        defaultValue: 'UU',
        enums: ['Revenue', 'UU', 'TransactionCount'],
      }),
    },
    bestCustomerQuery: {
      dependencies: ['@time', '@measureCustomer', 'bestUser'],
      factory: (time, measure, bestUser) => Promise.resolve({ time, measure, bestUser }),
    },
    bestCustomerTSAD: {
      dependencies: ['@time', '@measureCustomer', 'bestUser'],
      factory: (time, measure, bestUser) => Promise.resolve({ time, measure, bestUser }),
    },
    granularityCustomer: {
      factory: () => Promise.resolve({
        defaultValue: 'day',
        enums: ['day', 'week', 'month'],
      }),
    },
    customerExpensePerUserBucket: {
      dependencies: ['@time', '@granularityCustomer', 'bestUser'],
      factory: (time, granularity, bestUser) => Promise.resolve({
        time, granularity, bestUser, measure: 'RevenuePerUU',
      }),
    },
    customerExpensePerUserRank: {
      dependencies: ['@time', '@granularityCustomer', 'bestUser'],
      factory: (time, granularity, bestUser) => Promise.resolve({
        time, granularity, bestUser, measure: 'RevenuePerUU',
      }),
    },
    measureFavor: {
      factory: () => Promise.resolve({
        defaultValue: 'UU',
        enums: ['Revenue', 'UU', 'TransactionCount'],
      }),
    },
    dimensionFavor: {
      factory: () => Promise.resolve({
        defaultValue: 'BranchName',
        enums: ['BranchName', 'CardType', 'SKUType'],
      }),
    },
    favorBestCustomerReduce: {
      dependencies: ['@time', '@measureFavor', 'bestUser'],
      factory: (time, measure, bestUser) => Promise.resolve({
        time, measure, bestUser,
      }),
    },
    favorBestCustomerTrend: {
      dependencies: ['@time', '@measureFavor', 'bestUser'],
      factory: (time, measure, bestUser) => Promise.resolve({
        time, measure, bestUser,
      }),
    },
    usageMealCardReduce: {
      dependencies: ['@time', 'bestUser'],
      factory: (time, bestUser) => Promise.resolve({
        time, bestUser, measure: 'CardUU', Dimension: 'Channel',
      }),
    },
    usageMealCardBucketCRAP: {
      dependencies: ['@time', 'bestUser'],
      factory: (time, bestUser) => Promise.resolve({
        time, bestUser, measure: 'CardRechargeAmountPerUU',
      }),
    },
    usageMealCardQuery: {
      dependencies: ['@time', 'bestUser'],
      factory: (time, bestUser) => Promise.resolve({
        time, bestUser, measure: 'CardBalance',
      }),
    },
    usageMealCardBucketCB: {
      dependencies: ['@time', 'bestUser'],
      factory: (time, bestUser) => Promise.resolve({
        time, bestUser, measure: 'CardBalance',
      }),
    },
    revenue: { // from here to test chart with real data
      dependencies: ['@time'],
      factory: time => fetchData({
        parameters: {
          BranchName: {
            type: 'enum',
            values: ['AllUp'],
          },
          CardType: {
            type: 'enum',
            values: ['员工卡', '访客卡'],
          },
          MealName: {
            type: 'enum',
            values: ['午餐', '早餐'],
          },
          SKUType: {
            type: 'enum',
            values: ['AllUp'],
          },
          time: {
            type: 'range',
            values: time,
          },
        },
        metric: '169feb7a-c332-4979-9c6a-377bf2d75152',
      }),
    },
    formatRevenue2Line: {
      dependencies: ['revenue'],
      factory: revenue => convertData({
        ...revenue,
        groupDimensions: ['BranchName', 'MealName', 'SKUType', 'CardType'],
        axisDimensions: ['time'],
        metricDimensions: ['169feb7a-c332-4979-9c6a-377bf2d75152'],
        serieNameTemplate: 'BranchName({{BranchName}});MealName({{MealName}});SKUType({{SKUType}});CardType({{CardType}})',
      }),
    },
    top3Revenue: {
      dependencies: ['formatRevenue2Line'],
      factory: ({ source, seriesMapper }) => topNData({
        take: 3,
        metric: '169feb7a-c332-4979-9c6a-377bf2d75152',
        axisDimensions: ['time'],
        source,
        seriesMapper,
      }),
    },
  },
  id: '10000',
};
