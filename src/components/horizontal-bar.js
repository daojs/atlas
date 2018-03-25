import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
import { validate, getDimensionSeries } from '../utils';

export default class HorizontalBar extends PureComponent {
  render() {
    const {
      source,
    } = this.props.value;
    validate(source);
    const dimensions = _.first(source);
    const option = {
      legend: {},
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      dataset: {
        source,
        dimensions,
      },
      yAxis: { type: 'category' },
      xAxis: { type: 'value' },
      series: getDimensionSeries({
        dimensions,
        type: 'bar',
      }),
    };

    return (
      <ReactEcharts option={option} {...this.props} />
    );
  }
}

HorizontalBar.propTypes = {
  value: PropTypes.objectOf(PropTypes.any).isRequired,
};
