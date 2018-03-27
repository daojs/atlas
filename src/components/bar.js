/* eslint-disable class-methods-use-this */

import PropTypes from 'prop-types';
import _ from 'lodash';
import BaseChart from './base';

export default class Bar extends BaseChart {
  getAxisOption() {
    return {
      data: this.getAxisData(),
      type: 'category',
    };
  }

  getSeriesOption() {
    const source = this.getSource();
    return _.chain(this.getMetricDimensions())
      .map(dim => _.defaults({
        type: 'bar',
        name: dim,
        data: _.map(source, row => row[dim]),
      }))
      .value();
  }

  getOption() {
    return {
      legend: {},
      tooltip: {},
      yAxis: {},
      xAxis: this.getAxisOption(),
      series: this.getSeriesOption(),
    };
  }
}

Bar.propTypes = {
  value: PropTypes.objectOf(PropTypes.any).isRequired,
};
