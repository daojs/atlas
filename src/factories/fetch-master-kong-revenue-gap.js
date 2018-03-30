import _ from 'lodash';
import axios from 'axios';

export default function (client, simulation, { otherMetric }) {
  return () => {
    return axios.post('./insight', {
      '@target': 'master-kong',
      '@proc': 'query',
      '@args': [
        'Revenue',
        {
          aggregation: {
            target: 'sum',
            forecast: 'sum',
          },
          groupBy: {
            timestamp: 'day',
            [otherMetric]: 'value',
          },
        },
      ],
    }).then(({ data: { data } }) => data).then((data) => {
      const filtered = _.filter(data, item => !item.target && item.year == 18);
      const indexed = _.mapValues(_.groupBy(data, item => item[otherMetric]), subArr => _.keyBy(subArr, subItem => `${subItem.month} ${subItem.year}`));

      return _.map(filtered, (item) => {
        const monthLastYear = `${item.month} ${item.year - 1}`;

        const target = indexed[item[otherMetric]][monthLastYear].forecast * 1.05;

        return [
          item[otherMetric],
          `${item.month} ${item.year}`,
          (item.forecast - target) / target,
        ];
      });
    });
    // return simulation
    //   .then(({ forecast }) => client.call('dag', {
    //     revenueGapData: {
    //       '@proc': 'read',
    //       '@args': [
    //         forecast,
    //       ],
    //     },
    //     result: {
    //       '@proc': 'query2',
    //       '@args': [{
    //         '@ref': 'revenueGapData',
    //       }, {
    //         aggregation: {
    //           销售指标差距: 'sum',
    //         },
    //         filter: {
    //           [metric]: filter,
    //         },
    //         groupBy: {
    //           month: 'value',
    //           [otherMetric]: 'value',
    //         },
    //       }],
    //     },
    //   }, 'result')).then(data => data.map(item => ({
    //     forcast: item['预测销售额'],
    //     target: item['目标销售额'],
    //     ...item,
    //   })));
    // return simulation
    //   .then(({ forecast }) => client.call('dag', {
    //     revenueGapData: {
    //       '@proc': 'read',
    //       '@args': [
    //         forecast,
    //       ],
    //     },
    //     result: {
    //       '@proc': 'query2',
    //       '@args': [{
    //         '@ref': 'revenueGapData',
    //       }, {
    //         aggregation: {
    //           预测销售额: 'sum',
    //           目标销售额: 'sum',
    //         },
    //         filter: {},
    //         groupBy: {
    //           branch: 'value',
    //           category: 'value',
    //         },
    //       }],
    //     },
    //   }, 'result')).then(data => data.map(item => ({
    //     forcast: item['预测销售额'],
    //     target: item['目标销售额'],
    //     ...item,
    //   })));
  };
}
