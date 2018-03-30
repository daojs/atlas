// temp solution
import ReactEcharts from 'echarts-for-react';
import React, { PureComponent } from 'react';
import moment from 'moment';
import _ from 'lodash';

function generatePredicateData(startDate, endDate) {
  const list = {
    华北: () => (Math.random() * 100000) + 2600000,
    华东: () => (Math.random() * 100000) + 540000,
    华南: () => (Math.random() * 100000) + 200000,
    西南: () => (Math.random() * 100000) + 350000,
    西北: () => (Math.random() * 100000) + 350000,
    东北: () => (Math.random() * 100000) + 350000,
  };

  const thisMonth = moment().startOf('month');
  const lastMonth = thisMonth.clone().subtract(1, 'month');
  const start = thisMonth.clone().startOf('year');
  const end = thisMonth.clone().add(1, 'year');
  let day = start;

  const minData = [];
  const realData = [];
  const maxData = [];

  while (day.isBefore(thisMonth)) {
    const revenue = _.mapValues(list, func => func.call());
    revenue.total = _.reduce(revenue, (prev, curr) => prev + curr);
    revenue.date = day.format('YYYY-MM');
    realData.push(revenue);

    if (day.isSame(lastMonth)) {
      minData.push(revenue);
      maxData.push(revenue);
    } else {
      minData.push(null);
      maxData.push(null);
    }
    day = day.add(1, 'month');
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
    revenue.date = day.format('YYYY-MM');
    minRevenue.date = day.format('YYYY-MM');
    maxRevenue.date = day.format('YYYY-MM');

    realData.push(revenue);
    minData.push(minRevenue);
    maxData.push(maxRevenue);
    day = day.add(1, 'month');
  }

  return { minData, realData, maxData };
}

const { minData, realData, maxData } = generatePredicateData('2018-01-01', '2019-01-01');

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
