import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
import { validate, getDataOption } from '../utils';

export default class Line extends PureComponent {
  getSource() {
    const {
      source,
    } = this.props.value;
    return source;
  }

  getOption() {
    const dataOption = getDataOption({
      source: this.getSource(),
      defaultSeriesOpt: {
        type: 'line',
      },
    });

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
      xAxis: {
        type: 'category',
        boundaryGap: false,
      },
    }, {
      xAxis: dataOption.axis,
      series: dataOption.series,
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
