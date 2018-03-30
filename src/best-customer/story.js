import Promise from 'bluebird';
import _ from 'lodash';
import client from '../mock/worker';

// dags
import factories from '../factories';

const {
  fetchCustomerTSADFactory,
  fetchCustomerExpensePerUserBucketFactory,
  fetchCustomerExpensePerUserRankFactory,
  fetchFavorBestCustomerReduceFactory,
  fetchFavorBestCustomerTrendFactory,
  fetchUsageMealCardReduceFactory,
  fetchUsageMealCardBucketFactory,
  fetchTraffic,
  fetchTrendForGrowth,
} = factories;

const metricEnum = ['独立用户数', '利润', '交易笔数'];
const metricsDictionary = {
  利润: { revenue: 'sum' },
  独立用户数: { customerId: 'count' },
  交易笔数: { transactionId: 'count' },
};

const metricReverseDictionary = {
  revenue: '利润',
  customerId: '独立用户数',
  transactionId: '交易笔数',
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
    measureUser: { default: undefined },
    time: { default: { start: '2018-01-01', end: '2018-02-01' } },
    measureCustomer: { default: undefined },
    granularityCustomer: { default: undefined },
    measureFavor: { default: undefined },
    dimensionFavor: { default: undefined },
    measureActiveness: { default: undefined },
    measureGrowth: { default: undefined },
  },
  cells: {
    measureUser: {
      factory: () => Promise.resolve({
        defaultValue: '独立用户数',
        enums: metricEnum,
      }),
    },
    bestUser: {
      dependencies: ['@measureUser', '@time'],
      factory: () => Promise.resolve({ department: 'STC', discipline: 'SDE' }),
    },
    measureCustomer: {
      factory: () => Promise.resolve({
        defaultValue: '独立用户数',
        enums: metricEnum,
      }),
    },
    bestCustomerQuery: {
      dependencies: ['@time', '@measureCustomer', 'bestUser'],
      factory: (time, measure, bestUser) => Promise.resolve({ time, measure, bestUser }),
    },
    mapCustomerMetric: {
      dependencies: ['@measureCustomer'],
      factory: measure => ({
        利润: { revenue: 'sum' },
        独立用户数: { customerId: 'count' },
        交易笔数: { transactionId: 'count' },
      }[measure]),
    },
    fetchCustomerTSAD: {
      dependencies: ['@time', 'mapCustomerMetric', 'bestUser'],
      factory: fetchCustomerTSADFactory(client, simulation),
    },
    bestCustomerTSAD: {
      dependencies: ['fetchCustomerTSAD', 'mapCustomerMetric', 'bestUser', '@measureCustomer'],
      factory: ({ data }, metric, bestUser, metricName) => {
        if (_.some([data, metric, bestUser], _.isNil)) {
          return undefined;
        }
        return {
          source: data,
          axisDimensions: ['timestamp'],
          metricDimensions: _.keys(metric),
          title: `${metricName}的变化趋势`,
          key2name: metricReverseDictionary,
        };
      },
    },
    granularityCustomer: {
      factory: () => Promise.resolve({
        defaultValue: '日',
        enums: ['日', '周', '月'],
      }),
    },
    fetchCustomerExpencePerUserBucket: {
      dependencies: ['@time', '@granularityCustomer', 'bestUser'],
      factory: fetchCustomerExpensePerUserBucketFactory(client, simulation),
    },
    customerExpensePerUserBucket: {
      dependencies: ['fetchCustomerExpencePerUserBucket'],
      factory: (rawData) => {
        if (_.isEmpty(rawData)) {
          return undefined;
        }

        const data = _.map(rawData, d => ({
          销售额: `${d.revenue} ~ ${d.revenue + 10}`,
          用户数: d.customerId,
        }));

        return {
          source: data,
          axisDimensions: ['销售额'],
          metricDimensions: ['用户数'],
          // axisDimensions: ['revenue'],
          // metricDimensions: ['customerId'],
          key2name: metricReverseDictionary,
        };
      },
    },
    fetchCustomerExpensePerUserRank: {
      dependencies: ['@time', '@granularityCustomer', 'bestUser'],
      factory: fetchCustomerExpensePerUserRankFactory(client, simulation),
    },
    customerExpensePerUserRank: {
      dependencies: ['fetchCustomerExpensePerUserRank'],
      factory: (data) => {
        if (!data) {
          return undefined;
        }

        return {
          source: data,
          axisDimensions: ['customerId'],
          metricDimensions: ['revenue'],
          key2name: metricReverseDictionary,
        };
      },
    },
    measureFavor: {
      factory: () => Promise.resolve({
        defaultValue: '独立用户数',
        enums: metricEnum,
      }),
    },
    dimensionFavor: {
      factory: () => Promise.resolve({
        defaultValue: '餐厅名称',
        enums: ['餐厅名称', '餐卡类别', '菜品类别'],
      }),
    },
    fetchFavorBestCustomerReduce: {
      dependencies: ['@time', '@measureFavor', '@dimensionFavor', 'bestUser'],
      factory: fetchFavorBestCustomerReduceFactory(client, simulation, {
        metricsDictionary, groupByDictionary,
      }),
    },
    favorBestCustomerReduce: {
      dependencies: ['fetchFavorBestCustomerReduce', '@measureFavor', '@dimensionFavor'],
      factory: ({ data }, measure, dimension) => {
        const dimensionKey = _.keys(dimensionsDictionary[dimension])[0];
        const measureKey = _.keys(metricsDictionary[measure])[0];

        return Promise.resolve({
          source: data,
          axisDimensions: [dimensionKey],
          metricDimensions: [measureKey],
        });
      },
    },
    fetchFavorBestCustomerTrend: {
      dependencies: ['@time', '@measureFavor', '@dimensionFavor', 'bestUser'],
      factory: fetchFavorBestCustomerTrendFactory(client, simulation, {
        metricsDictionary, groupByDictionary,
      }),
    },
    favorBestCustomerTrend: {
      dependencies: ['fetchFavorBestCustomerTrend', '@measureFavor', '@dimensionFavor'],
      factory: ({ data: rawData }, measure, dimension) => {
        if (_.some([rawData, measure, dimension], _.isNil)) {
          return undefined;
        }

        const dimensionKey = _.keys(dimensionsDictionary[dimension])[0];
        const measureKey = _.keys(metricsDictionary[measure])[0];

        const dataAggregated = _.chain(rawData)
          .groupBy(_.property('timestamp'))
          .mapValues(val => _.reduce(val, (memo, cur) => ({
            [cur[dimensionKey]]: cur[measureKey], ...memo,
          }), {}))
          .value();

        const series = _.uniq(_.reduce(dataAggregated, (memo, cur) => [
          ..._.keys(cur), ...memo], []));

        const source = _.map(dataAggregated, (val, key) => ({
          timestamp: key,
          ..._.zipObject(series, _.map(series, s => val[s] || 0)),
        }));

        return Promise.resolve({
          source,
          axisDimensions: ['timestamp'],
          key2name: metricReverseDictionary,
        });
      },
    },

    // Section 4
    fetchUsageMealCardReduce: {
      dependencies: ['@time', 'bestUser'],
      factory: fetchUsageMealCardReduceFactory(client, simulation),
    },
    usageMealCardReduce: {
      dependencies: ['fetchUsageMealCardReduce'],
      factory: ({ data }) => Promise.resolve({
        title: `共有${_.sum(_.map(data, 'customerId'))}人充值`,
        source: data,
        axisDimensions: ['cardType'],
        metricDimensions: ['customerId'],
      }),
    },
    fetchUsageMealCardBucketCRAP: {
      dependencies: ['@time', 'bestUser'],
      factory: fetchUsageMealCardBucketFactory(client, simulation),
    },
    usageMealCardBucketCRAP: {
      dependencies: ['fetchUsageMealCardBucketCRAP'],
      factory: data => Promise.resolve({
        source: data,
        axisDimensions: ['rechargeAmount'],
        metricDimensions: ['customerId'],
        key2name: metricReverseDictionary,
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
    fetchTraffic: {
      dependencies: ['@time', '@measureActiveness', 'bestUser'],
      factory: fetchTraffic(client, simulation, { metricsDictionary }),
    },
    measureActiveness: {
      factory: () => Promise.resolve({
        defaultValue: '独立用户数',
        enums: metricEnum,
      }),
    },
    activenessTraffic: {
      dependencies: ['fetchTraffic', '@measureActiveness', 'bestUser'],
      factory: (rawData, measure, bestUser) => {
        if (_.some([rawData, measure, bestUser], _.isNil)) {
          return undefined;
        }

        // sort the data to know start & end
        const sorted = _.sortBy(rawData, 'timestamp');

        const first = sorted[0].timestamp;
        const end = _.last(sorted).timestamp;

        const keyed = _.keyBy(sorted, 'timestamp');

        const measureKey = _.keys(metricsDictionary[measure])[0];

        // fill 0 data in
        const source = _.map(_.range(first, end + 1, 10 * 60 * 1000), time => ({
          timestamp: (new Date(time)).toLocaleTimeString({}, { hour: '2-digit', minute: '2-digit', hour12: false }),
          [measureKey]: keyed[time] ? keyed[time][measureKey] : 0,
        }));

        return Promise.resolve({
          source,
          axisDimensions: ['timestamp'],
          key2name: metricReverseDictionary,
        });
      },
    },
    measureGrowth: {
      factory: () => Promise.resolve({
        defaultValue: '独立用户数',
        enums: metricEnum,
      }),
    },
    fetchTrendForGrowth: {
      dependencies: ['@time', '@measureGrowth', 'bestUser'],
      factory: fetchTrendForGrowth(client, simulation, { metricsDictionary }),
    },
    fetchCumulativeTrend: {
      dependencies: ['fetchTrendForGrowth', '@measureGrowth'],
      factory: ({ data: trend }, measure) => {
        if (_.some([trend, measure], _.isNil)) {
          return undefined;
        }
        const measureKey = _.keys(metricsDictionary[measure])[0];
        return client.call('cumulative', trend, {
          measureKey,
          timestampKey: 'timestamp',
        });
      },
    },
    fetchGrowthRateTrend: {
      dependencies: ['fetchTrendForGrowth', '@measureGrowth'],
      factory: ({ data: trend }, measure) => {
        if (_.some([trend, measure], _.isNil)) {
          return undefined;
        }
        const measureKey = _.keys(metricsDictionary[measure])[0];
        return client.call('growthRate', trend, {
          measureKey,
          timestampKey: 'timestamp',
        });
      },
    },
    growthAbilityCumulative: {
      dependencies: ['fetchCumulativeTrend', '@measureGrowth', 'bestUser'],
      factory: (rawData, measure, bestUser) => {
        if (_.some([rawData, measure, bestUser], _.isNil)) {
          return undefined;
        }

        const measureKey = _.keys(metricsDictionary[measure])[0];

        const source = _.map(rawData, ({ timestamp, value }) => ({
          timestamp,
          [measureKey]: value,
        }));

        return Promise.resolve({
          title: '累计的变化趋势',
          source,
          axisDimensions: ['timestamp'],
          key2name: metricReverseDictionary,
        });
      },
    },
    growthAbilityGrowthRate: {
      dependencies: ['fetchGrowthRateTrend', '@measureGrowth', 'bestUser'],
      factory: (rawData, measure, bestUser) => {
        if (_.some([rawData, measure, bestUser], _.isNil)) {
          return undefined;
        }

        const measureKey = _.keys(metricsDictionary[measure])[0];

        const source = _.map(rawData, ({ timestamp, value }) => ({
          timestamp,
          [measureKey]: value,
        }));

        return Promise.resolve({
          title: '增长率的变化趋势',
          source,
          axisDimensions: ['timestamp'],
          key2name: metricReverseDictionary,
        });
      },
    },
  },
  id: '10001',
};
