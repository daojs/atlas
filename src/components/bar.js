import _ from 'lodash';
import React from 'react';
import AtlasChart from './atlas-chart';

export default function Bar(props) {
  return (
    <AtlasChart
      value={props.value}
      getOption={({
        source,
        metricDimensions,
        axisOption,
      }) => {
        const argumentAxis = {
          boundaryGap: true,
          ...axisOption,
        };
        
        const dependentAxis = {};
        
        return {
          legend: {},
          tooltip: {},
          yAxis: props.isHorizontal ? argumentAxis : dependentAxis,
          series: _.map(metricDimensions, dim => ({
            type: 'bar',
            name: _.get(props.value, `key2name[${dim}]`, dim),
            data: _.map(source, row => row[dim]),
          })),
          xAxis: props.isHorizontal ? dependentAxis : argumentAxis,
        };
      }}
    />
  );
}
