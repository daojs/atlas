import React from 'react';
import { Form } from 'antd';
import 'antd/dist/antd.css';

import StoryBoard from '../story-board';
import sampleStory from './story';
import components from '../components';

const {
  Data,
  TimeRange,
  SingleSelector,
  Card,
} = components;

function WithLabel(Control, label) {
  return props => <Control label={label} {...props} />;
}

export default function () {
  return (<StoryBoard
    components={components}
    story={sampleStory}
    renderComponent={() => (
      <Form>
        <Data input="measureGlobal" output="@measureGlobal" renderCell={WithLabel(SingleSelector, 'Measure')} />
        <Data output="@time" renderCell={WithLabel(TimeRange, 'Time Range')} />
        <Data input="bestUser" renderCell={WithLabel(Card, 'Best User Card')} />
      </Form>
    )}
  />);
}
