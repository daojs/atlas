import PropTypes from 'prop-types';
import _ from 'lodash';
import BaseChart from './base';

export default class Donut extends BaseChart {
  getMetricDimensions() {
    // Donut chart only supports 1 dimension
    return _.slice(super.getMetricDimensions(), 0, 1);
  }

  getSourceAndAggregateRest() {
    const rawSource = this.getSource();
    const axisDim = this.getAxisDimension();

    const sortedSource = _.reverse(_.sortBy(rawSource, this.getMetricDimensions()));

    const metricKey = _.first(this.getMetricDimensions()) || 'customerId';

    return [..._.slice(sortedSource, 0, 4), {
      [axisDim]: '其他',
      [metricKey]: _.sum(_.map(_.slice(sortedSource, 4), metricKey)),
    }];
  }

  getSeriesOption() {
    const source = this.getSourceAndAggregateRest();
    const axisDim = this.getAxisDimension();

    return _.chain(this.getMetricDimensions())
      .map(metricDim => ({
        type: 'pie',
        name: metricDim,
        radius: ['50%', '70%'],
        hoverOffset: 0,
        label: {
          normal: {
            show: false,
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: _.map(source, row => ({
          name: row[axisDim],
          value: row[metricDim],
        })),
      }))
      .value();
  }

  getLegendOption() {
    const source = this.getSourceAndAggregateRest();
    const axisDim = this.getAxisDimension();
    const metricDim = this.getMetricDimensions()[0];

    return this.props.hasLegend ?
      {
        orient: 'vertical',
        top: 'middle',
        right: '5%',
        // Use circle icon for all legends
        data: _.map(source, row => ({
          name: row[axisDim],
          icon: 'circle',
        })),
        formatter: name => _.chain(source)
          .filter(row => row[axisDim] === name)
          .map((() => {
            const total = _.chain(source)
              .reduce((tot, row) => tot + row[metricDim], 0)
              .value();

            return row => `${row[axisDim]} | ${_.round((row[metricDim] / total) * 100, 2)}%    ${row[metricDim]}`;
          })())
          .first()
          .value(),
      } :
      {
        show: false,
      };
  }

  getTitleOption() {
    const {
      title,
      subTitle,
    } = this.props;
    return {
      text: title,
      subtext: subTitle,
      x: 'center',
      y: 'center',
      textStyle: {
        fontSize: '26',
      },
      subtextStyle: {
        fontSize: '16',
      },
    };
  }

  getOption() {
    return {
      legend: this.getLegendOption(),
      tooltip: {
        trigger: 'item',
        // {a} === seriesName, {b} === name, {c} === value, {d} === percent
        formatter: '{b}: {d}%',
      },
      ...super.getOption(),
    };
  }
}

Donut.propTypes = {
  value: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  hasLegend: PropTypes.bool,
};

Donut.defaultProps = {
  title: '',
  subTitle: '',
  hasLegend: true,
};
