import Promise from 'bluebird';
import _ from 'lodash';
import client from '../mock/worker';

// dags
import dags from '../dags';

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
} = dags;

const metricsDictionary = {
  利润: { revenue: 'sum' },
  独立用户数: { customerId: 'count' },
  交易笔数: { transactionId: 'count' },
};

const dimensionsDictionary = {
  餐厅名称: {
    branchName: { type: 'any' },
  },
  餐卡类别: {
    cardType: { type: 'any' },
  },
  菜品类别: {
    skuType: { type: 'any' },
  },
};

const groupByDictionary = {
  餐厅名称: 'branchName',
  餐卡类别: 'cardType',
  菜品类别: 'skuType',
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
        enums: ['利润', '独立用户数', '交易笔数'],
      }),
    },
    bestUser: {
      dependencies: ['@measureUser', '@time'],
      factory: () => Promise.resolve({ department: 'STC', discipline: 'SDE' }),
    },
    measureCustomer: {
      factory: () => Promise.resolve({
        defaultValue: '独立用户数',
        enums: ['利润', '独立用户数', '交易笔数'],
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
      dependencies: ['fetchCustomerTSAD', 'mapCustomerMetric', 'bestUser'],
      factory: (data, metric, bestUser) => {
        if (_.some([data, metric, bestUser], _.isNil)) {
          return undefined;
        }
        return {
          source: data,
          axisDimensions: ['timestamp'],
          metricDimensions: _.keys(metric),
        };
      },
    },
    granularityCustomer: {
      factory: () => Promise.resolve({
        defaultValue: 'day',
        enums: ['day', 'week', 'month'],
      }),
    },
    fetchCustomerExpencePerUserBucket: {
      dependencies: ['@time', '@granularityCustomer', 'bestUser'],
      factory: fetchCustomerExpensePerUserBucketFactory(client, simulation),
    },
    customerExpensePerUserBucket: {
      dependencies: ['fetchCustomerExpencePerUserBucket'],
      factory: (data) => {
        if (!data) {
          return undefined;
        }

        return {
          source: data,
          axisDimensions: ['revenue'],
          metricDimensions: ['customerId'],
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
        };
      },
    },
    measureFavor: {
      factory: () => Promise.resolve({
        defaultValue: '独立用户数',
        enums: ['利润', '独立用户数', '交易笔数'],
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
      factory: (data, measure, dimension) => {
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
      factory: (rawData, measure, dimension) => {
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
      factory: data => Promise.resolve({
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
        enums: ['利润', '独立用户数', '交易笔数'],
      }),
    },
    activenessTraffic: {
      dependencies: ['fetchTraffic', '@measureActiveness', 'bestUser'],
      factory: (rawData, measure, bestUser) => {
        if (_.some([rawData, measure, bestUser], _.isNil)) {
          return undefined;
        }

        // sort the data to know start & end
        const sorted = _.sortBy(_.map(rawData, ({ timestamp, ...rest }) => ({
          time: new Date(`1970-01-01T${timestamp}:00.000Z`),
          timestamp,
          ...rest,
        })), 'time');

        const first = Number(sorted[0].time);
        const end = Number(_.last(sorted).time);

        const keyed = _.keyBy(sorted, item => Number(item.time));

        const measureKey = _.keys(metricsDictionary[measure])[0];

        // fill 0 data in
        const source = _.map(_.range(first, end + 1, 10 * 60 * 1000), time => ({
          timestamp: (new Date(time)).toISOString().substr(11, 5),
          [measureKey]: keyed[time] ? keyed[time][measureKey] : 0,
        }));

        return Promise.resolve({
          source,
          axisDimensions: ['timestamp'],
        });
      },
    },
    measureGrowth: {
      factory: () => Promise.resolve({
        defaultValue: '独立用户数',
        enums: ['利润', '独立用户数', '交易笔数'],
      }),
    },
    fetchTrendForGrowth: {
      dependencies: ['@time', '@measureGrowth', 'bestUser'],
      factory: fetchTrendForGrowth(client, simulation, { metricsDictionary }),
    },
    fetchCumulativeTrend: {
      dependencies: ['fetchTrendForGrowth', '@measureGrowth'],
      factory: (trend, measure) => {
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
      factory: (trend, measure) => {
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
          source,
          axisDimensions: ['timestamp'],
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
          source,
          axisDimensions: ['timestamp'],
        });
      },
    },
  },
  id: '10000',
};
