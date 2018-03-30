/* eslint-disable class-methods-use-this */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';


export default class BaseChart extends PureComponent {
  getSource() {
    const {
      source,
    } = this.props.value;
    if (_.isNil(source)) {
      throw new Error('Chart source is nil');
    }

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
      .map((row) => {
        const rawData = row[axisDim];
        if (axisDim === 'timestamp' && _.isString(rawData)) {
          return rawData.replace('T00:00:00Z', '').replace('T00:00:00.000Z', '');
        }
        return rawData;
      })
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
    throw new Error('Unimplement BaseChart.getSeriesOption()');
  }

  getTitleOption() {
    return {
      text: this.props.value.title || this.props.title,
    };
  }

  getOption() {
    return {
      title: this.getTitleOption(),
      series: this.getSeriesOption(),
    };
  }

  getEvents() {
    return {};
  }

  render() {
    if (_.isEmpty(this.getSource())) {
      return null;
    }
    return (
      <ReactEcharts
        theme="theme1"
        option={this.getOption()}
        notMerge={true} //eslint-disable-line
        onEvents={this.getEvents()}
        {...this.props}
      />
    );
  }
}

BaseChart.propTypes = {
  value: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.string,
};

BaseChart.defaultProps = {
  title: '',
};
