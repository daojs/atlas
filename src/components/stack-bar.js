import _ from 'lodash';
import BaseChart from './base';

export default class StackBar extends BaseChart {
  getAxisOption() {
    return {
      data: this.getAxisData(),
      type: 'category',
    };
  }

  getSeriesOption() {
    const source = this.getSource();
    return _.chain(this.getMetricDimensions())
      .map(dim => ({
        type: 'bar',
        name: dim,
        data: _.map(source, row => row[dim]),
        stack: 'total',
      }))
      .value();
  }

  getOption() {
    return {
      legend: {},
      tooltip: {},
      yAxis: {},
      xAxis: this.getAxisOption(),
      ...super.getOption(),
    };
  }
}

