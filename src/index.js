import ReactDOM from 'react-dom';
import React from 'react';
import { Form } from 'antd';
import 'antd/dist/antd.css';
import _ from 'lodash';

import StoryBoard from './story-board';
import sampleStory from './sample-story';
import components from './components';
import BestCustomer from './best-customer/layout';

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // eslint-disable-line

const {
  TimeSeries,
  Cell,
  Slicer,
  FormInput,
  FormField,
} = components;

function WithLabel(Control, label) {
  return props => <Control label={label} {...props} />;
}

ReactDOM.render(
  <StoryBoard
    components={components}
    story={sampleStory}
    renderComponent={() => (
      <Form>
        <Slicer parameter="@foo" renderSlicer={WithLabel(FormInput, 'foo')} />
        <Slicer parameter="@bar" renderSlicer={WithLabel(FormInput, 'bar')} />
        <Cell renderCell={WithLabel(FormField, 'tic')} parameter="tic" />
        <Cell renderCell={WithLabel(FormField, 'tac')} parameter="tac" />
        <Cell renderCell={WithLabel(FormField, 'toe')} parameter="toe" />
        <TimeSeries />
      </Form>
    )}
  />,
  document.getElementById('container'),
);

ReactDOM.render(
  <BestCustomer />,
  document.getElementById('bestcustomer'),
);
