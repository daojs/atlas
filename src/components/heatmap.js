import _ from 'lodash';
import BaseChart from './base';

export default class Heatmap extends BaseChart {
  getSeriesOption() {
    const metrics = this.getMetricDimensions();

    if (metrics.length !== 1) {
      throw new Error('Heatmap only accepts one metric option');
    }

    return [{
      name: metrics[0],
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
    }];
  }

  getOption() {
    const source = this.getSource();
    const metrics = this.getMetricDimensions();

    const data = _.map(source, row => row[metrics[0]]);

    return {
      legend: {},
      tooltip: {
        position: 'top',
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
        min: _.min(data),
        max: _.max(data),
        calculable: true,
        left: 'left',
        top: 'bottom',
      },
      ...super.getOption(),
    };
  }
}
