import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default function TimeSeries({
  start,
  end,
  data,
}) {
  return (
    <ReactEcharts
      theme="theme1"
      option={
        {
          title: {
            text: 'Time Series',
          },
          tooltip: {},
          legend: {
            data: ['Revenue'],
          },
          xAxis: {
            // type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          yAxis: {
            // type: 'value',
          },
          series: [{
            name: 'Revenue',
            data: [820, 932, 901, null, 1290, 1330, 1320],
            type: 'line',
            smooth: true,
          }],
        }
      }
    />
  );
}
