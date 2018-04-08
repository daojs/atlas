import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';

export default class AtlasChart extends React.Component {
  static propTypes = {
    value: PropTypes.objectOf(PropTypes.any).isRequired,
    title: PropTypes.string,
    getOption: PropTypes.func.isRequired,
    onEvents: PropTypes.objectOf(PropTypes.any),
  }

  static defaultProps = {
    title: null,
    onEvents: {},
  }

  render() {
    const {
      source,
      axisDimensions,
      metricDimensions,
      title,
    } = this.props.value;
    if (_.isNil(source)) {
      throw new Error('Chart source is nil');
    }

    if (_.isEmpty(source)) {
      return null;
    }

    const dimensions = _.keys(_.head(source));

    const axisDimension = _.head(axisDimensions)
      || _.head(dimensions);

    const axisData = _.map(source, (row) => {
      const rawData = row[axisDimension];
      if (axisDimension === 'timestamp' && _.isString(rawData)) {
        return rawData.replace('T00:00:00Z', '').replace('T00:00:00.000Z', '');
      }
      return rawData;
    });

    const axisOption = {
      data: axisData,
      type: 'category',
      boundaryGap: false,
    };

    const metricDims = _.isEmpty(metricDimensions) ?
      _.difference(dimensions, [axisDimension]) :
      metricDimensions;

    const titleOption = {
      text: title || this.props.title,
    };

    const option = {
      titleOption,
      ...this.props.getOption({
        source,
        dimensions,
        axisDimension,
        metricDimensions: metricDims,
        axisData,
        axisOption,
        titleOption,
      }),
    };

    return (
      <ReactEcharts
        theme="theme1"
        option={option}
        notMerge={true} //eslint-disable-line
        onEvents={this.props.onEvents}
        {...this.props}
      />
    );
  }
}
