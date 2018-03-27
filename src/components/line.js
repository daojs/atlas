import PropTypes from 'prop-types';
import _ from 'lodash';
import BaseChart from './base';

export default class Line extends BaseChart {
  getSeriesOption() {
    const source = this.getSource();
    return _.chain(this.getMetricDimensions())
      .map(dim => _.defaults({
        type: 'line',
        name: dim,
        data: _.map(source, row => row[dim]),
      }))
      .value();
  }

  getOption() {
    return _.defaultsDeep({
      title: {
        text: this.props.title,
      },
      legend: {},
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
      },
      xAxis: this.getAxisOption(),
      series: this.getSeriesOption(),
    });
  }

  getEvents() {
    return {
      click: args =>
        this.props.onSlicerChange(_.defaults(
          {}, { dataObj: _.zipObject(this.getDimensions(), args.data) },
          args,
        )),
    };
  }
}

Line.propTypes = {
  title: PropTypes.string,
  onSlicerChange: PropTypes.func,
};

Line.defaultProps = {
  onSlicerChange: _.noop,
  title: '',
};
