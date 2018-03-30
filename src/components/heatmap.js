import React from 'react';
import _ from 'lodash';
import ReactEcharts from 'echarts-for-react';
import BaseChart from './base';

export default class Heatmap extends BaseChart {
  getSeriesOption() {
    const metrics = this.getMetricDimensions();

    return [{
      name: metrics[0],
      type: 'heatmap',
      label: {
        normal: {
          show: false,
        },
      },
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    }];
  }

  getOption() {
    const source = this.getSource();
    // const metrics = this.getMetricDimensions();

    const maxAbs = _.max(_.map(source, row => Math.abs(row[2])));
    
    return {
      legend: {
        show: false,
      },
      tooltip: {
        position: 'top',
        formatter: ({ data: itemData }) => `${itemData[0]}: ${itemData[2].toFixed(2)}`,
      },
      dataset: {
        source,
      },
      xAxis: {
        type: 'category',
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: 'category',
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        min: -maxAbs,
        max: maxAbs,
        calculable: true,
        left: 'left',
        top: 'bottom',
        inRange: {
          color: ['red', 'white', 'green'],
        },
        show: false,
      },
      ...super.getOption(),
    };
  }

  render() {
    if (_.isEmpty(this.getSource())) {
      return null;
    }
    return (
      <ReactEcharts
        style={{ height: 600 }}
        option={this.getOption()}
        notMerge={true} //eslint-disable-line
        onEvents={this.getEvents()}
        {...this.props}
      />
    );
  }
}
