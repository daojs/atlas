// temp solution
import ReactEcharts from 'echarts-for-react';
import React, { PureComponent } from 'react';
import moment from 'moment';
import _ from 'lodash';

function generatePredicateData(startDate, endDate) {
  const list = {
    员工餐厅: () => (Math.random() * 1000) + 26000,
    北京小院: () => (Math.random() * 1000) + 5400,
    咖喱屋: () => (Math.random() * 1000) + 2000,
    自助餐厅: () => (Math.random() * 1000) + 3500,
  };

  const today = moment().startOf('day');
  const start = moment(startDate).startOf('day');
  const end = moment(endDate).startOf('day');
  let day = start;

  const minData = [];
  const realData = [];
  const maxData = [];

  while (day.isBefore(today) || day.isSame(today)) {
    const revenue = _.mapValues(list, func => func.call());
    revenue.total = _.reduce(revenue, (prev, curr) => prev + curr);
    revenue.date = day.format('YYYY-MM-DD');
    realData.push(revenue);

    if (day.isSame(today)) {
      minData.push(revenue);
      maxData.push(revenue);
    } else {
      minData.push(null);
      maxData.push(null);
    }
    day = day.add(1, 'day');
  }

  while (day.isBefore(end)) {
    const revenue = _.mapValues(list, func => func.call());
    const minRevenue = _.mapValues(revenue, value => value * (1 - (Math.random() / 6)));
    const maxRevenue = _.mapValues(revenue, value => value * (1 + (Math.random() / 6)));

    revenue.total = _.reduce(revenue, (prev, curr) => prev + curr);
    minRevenue.total =
      _.reduce(minRevenue, (prev, curr) => prev + curr);
    maxRevenue.total =
      _.reduce(maxRevenue, (prev, curr) => prev + curr);
    revenue.date = day.format('YYYY-MM-DD');
    minRevenue.date = day.format('YYYY-MM-DD');
    maxRevenue.date = day.format('YYYY-MM-DD');

    realData.push(revenue);
    minData.push(minRevenue);
    maxData.push(maxRevenue);
    day = day.add(1, 'day');
  }

  return { minData, realData, maxData };
}

const { minData, realData, maxData } = generatePredicateData('2018-03-21', '2018-04-15');

export default class extends PureComponent {
  xData = _.map(realData, i => i.date);
  render() {
    this.getOption = () => { // eslint-disable-line
      return {
        xAxis: {
          type: 'category',
          data: this.xData,
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          data: _.map(realData, item => _.result(item, 'total'), null),
          type: 'line',
          smooth: true,
        }, {
          data: _.map(minData, item => _.result(item, 'total', null)),
          type: 'line',
          smooth: true,
          lineStyle: {
            type: 'dashed',
          },
        }, {
          data: _.map(maxData, item => _.result(item, 'total', null)),
          type: 'line',
          smooth: true,
          lineStyle: {
            type: 'dashed',
          },
        }],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
      };
    };

    return (
      <ReactEcharts
        theme="theme1"
        option={this.getOption()}
        notMerge={true} //eslint-disable-line
        {...this.props}
      />
    );
  }
}
