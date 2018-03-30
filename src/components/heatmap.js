import _ from 'lodash';
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

    const data = _.map(source, row => row[2]);

    return {
      legend: {
        show: false,
      },
      tooltip: {
        position: 'top',
        formatter: ({ data: itemData }) => `${itemData[0]}: ${itemData[2]}`,
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
        inRange: {
          color: ['green', 'white', 'red'],
        },
        show: false,
      },
      ...super.getOption(),
    };
  }
}
