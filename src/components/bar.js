import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
import { validate, getDimensionSeries } from '../utils';

export default class Bar extends PureComponent {
  render() {
    const {
      source,
    } = this.props.value;
    validate(source);
    const dimensions = _.first(source);

    const option = {
      legend: {},
      tooltip: {},
      dataset: {
        source,
        dimensions,
      },
      yAxis: {},
      xAxis: { type: 'category' },
      series: getDimensionSeries({
        dimensions,
        type: 'bar',
      }),
    };

    return (
      <ReactEcharts
        option={option}
        notMerge={true} //eslint-disable-line
        {...this.props}
      />
    );
  }
}

Bar.propTypes = {
  value: PropTypes.objectOf(PropTypes.any).isRequired,
};
