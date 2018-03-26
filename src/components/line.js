import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
import { validate } from '../utils';


export default class Line extends PureComponent {
  getSource() {
    const {
      source,
    } = this.props.value;
    return source;
  }

  getDimensions() {
    return _.chain(this.getSource())
      .first()
      .keys()
      .value();
  }

  getAxisDimension() {
    return _.first(this.props.value.axisDimensions) ||
      _.first(this.getDimensions());
  }

  getAxisData() {
    const axisDim = this.getAxisDimension();
    return _.chain(this.getSource())
      .map(row => row[axisDim])
      .value();
  }

  getAxisOption() {
    return {
      data: this.getAxisData(),
      type: 'category',
      boundaryGap: false,
    };
  }

  getMetricDimensions() {
    return _.isEmpty(this.props.value.metricDimensions) ?
      _.difference(this.getDimensions(), [this.getAxisDimension()]) :
      this.props.value.metricDimensions;
  }

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

  render() {
    const source = this.getSource();

    validate(source);
    const onEvents = {
      click: args =>
        this.props.onSlicerChange(_.defaults(
          {}, { dataObj: _.zipObject(_.first(source), args.data) },
          args,
        )),
    };

    return (
      <ReactEcharts
        option={this.getOption()}
        notMerge={true} //eslint-disable-line
        onEvents={onEvents}
        {...this.props}
      />
    );
  }
}

Line.propTypes = {
  value: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.string,
  onSlicerChange: PropTypes.func,
};

Line.defaultProps = {
  onSlicerChange: _.noop,
  title: '',
};
