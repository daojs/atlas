import PropTypes from 'prop-types';
import _ from 'lodash';
import BaseChart from './base';

/* Demo usage
 <Line value={
    source: [{
      timestamp: '2018/1/1',
      value: 10,
    }, {
      timestamp: '2018/1/2',
      value: 20,
    }],
    // Axis dimension would be drawn as X axis.
    // Although line chart only supports 1 axis dimension,
    // we define the prop as array for better extensibility
    axisDimensions: ['timestamp']
    // Metric dimensions prop is optional.
    // If not specified, all dimensions except axis dimensions would be used.
    metricDimensions: ['value']
  }/>
*/
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
