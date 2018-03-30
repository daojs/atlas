import _ from 'lodash';

function customizer(objValue, srcValue) {
  return _.merge(objValue[0], srcValue[0]);
}
const metric2String = {
  Revenue: '销售额',
  Volume: '销量',
};

export default function (metric) {
  return (gapData, cumulativeData) => {
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
    const metricString = metric2String[metric];

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
      key2Name: {
        target: `目标${metricString}`,
        forecast: `预测${metricString}`,
        targetGap: `累计目标${metricString}`,
        forecastGap: `累计预测${metricString}`,
      },
    };
  };
}
