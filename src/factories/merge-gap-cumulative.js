import _ from 'lodash';

function customizer(objValue, srcValue) {
  return _.merge(objValue[0], srcValue[0]);
}

export default function () {
  return ({ data: gapData }, cumulativeData) => {
    const transformCumulative = _.map(cumulativeData, ({
      month,
      target: targetCumulative,
      forecast: forecastCumulative,
    }) => (
      {
        month,
        targetGap: targetCumulative,
        forecastGap: forecastCumulative,
      }
    ));
    const mergedData = _.mergeWith(_.groupBy(gapData, 'month'), _.groupBy(transformCumulative, 'month'), customizer);

    return {
      xAxisMetric: 'month',
      yAxisMetrics: [{
        metrics: ['target', 'forecast'],
        type: 'bar',
        name: '月销售额',
      }, {
        metrics: ['targetGap', 'forecastGap'],
        type: 'line',
        name: '年销售额',
      }],
      source: _.values(mergedData),
      metricDimensions: ['target', 'forecast', 'targetGap', 'forecastGap'],
    };
  };
}
