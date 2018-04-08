import _ from 'lodash';
import React from 'react';
import Bar from './bar';

export default function HorizontalBar(props) {
  return (
    <Bar
      value={props.value}
      isHorizontal
    />
  );
}
