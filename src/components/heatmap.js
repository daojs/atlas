import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
import { validate } from '../utils';

export default class Heatmap extends PureComponent {
  static propTypes = {
    value: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  render() {
    const { source } = this.props.value;
    validate(source);

    const dimensions = _.first(source);
    const newSource = _.zip(...source);
    const data = _.nth(newSource, 2).slice(1);
    const option = {
      legend: {},
      tooltip: {
        position: 'top',
      },
      xAxis: {
        type: 'category',
        splitArea: {
          show: true,
        },
        position: 'top',
      },
      yAxis: {
        type: 'category',
        splitArea: {
          show: true,
        },
        inverse: true,
      },
      visualMap: {
        min: _.min(data),
        max: _.max(data),
        calculable: true,
        left: 'center',
        top: 'bottom',
        orient: 'horizontal',
      },
      series: [{
        name: _.last(dimensions),
        data: source,
        type: 'heatmap',
        label: {
          normal: {
            show: true,
          },
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }],
    };

    return (
      <ReactEcharts option={option} {...this.props} />
    );
  }
}
