import fetchMasterKongRevenueAndVolumnTrend from './fetch-master-kong-revenue-and-volumn-trend';
import fetchMasterKongRevenueGap from './fetch-master-kong-revenue-gap';
import fetchCustomerTSADFactory from './fetch-customer-tsad';
import mergeMonthAndYearData from './merge-gap-cumulative';
import fetchCustomerExpensePerUserBucketFactory from './fetch-customer-expense-per-user-bucket';
import fetchCustomerExpensePerUserRankFactory from './fetch-customer-expense-per-user-rank';
import fetchFavorBestCustomerReduceFactory from './fetch-favor-best-customer-reduce';
import fetchFavorBestCustomerTrendFactory from './fetch-favor-best-customer-trend';
import fetchUsageMealCardReduceFactory from './fetch-usage-meal-card-reduce';
import fetchUsageMealCardBucketFactory from './fetch-usage-meal-card-bucket';
import fetchTraffic from './fetch-traffic';
import fetchTrendForGrowth from './fetch-trend-for-growth';
import fetchMetricTrend from './fetch-metric-trend';
import fetchRevenueForecast from './fetch-revenue-forecast';
import fetchMasterKongSalesLastYear from './fetch-master-kong-sales-last-year';
import fetchMasterKongAnnualGoalCompRisk from './fetch-master-kong-annual-goal-comp-risk';
import fetchMasterKongRevenueForecast from './fetch-master-kong-revenue-forecast';
import fetchMasterKongVolumeForecast from './fetch-master-kong-volume-forecast';

export default {
  fetchMasterKongRevenueAndVolumnTrend,
  mergeMonthAndYearData,
  fetchMasterKongRevenueGap,
  fetchCustomerTSADFactory,
  fetchCustomerExpensePerUserBucketFactory,
  fetchCustomerExpensePerUserRankFactory,
  fetchFavorBestCustomerReduceFactory,
  fetchFavorBestCustomerTrendFactory,
  fetchUsageMealCardReduceFactory,
  fetchUsageMealCardBucketFactory,
  fetchTraffic,
  fetchTrendForGrowth,
  fetchMetricTrend,
  fetchRevenueForecast,
  fetchMasterKongSalesLastYear,
  fetchMasterKongAnnualGoalCompRisk,
  fetchMasterKongRevenueForecast,
  fetchMasterKongVolumeForecast,
};
