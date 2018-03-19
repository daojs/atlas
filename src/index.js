import ReactDOM from 'react-dom';
import React from 'react';
import { Form, Input, Spin } from 'antd';
import 'antd/dist/antd.css';

import StoryBoard from './story-board';
import sampleStory from './sample-story';
import components from './components';

const { TimeSeries } = components;

ReactDOM.render(
  <StoryBoard
    components={components}
    story={sampleStory}
    renderContent={({
      read,
      write,
      isUpdating,
    }) => (
      <Form>
        <Form.Item label="foo">
          <Input defaultValue={read('foo')} onChange={e => write('foo', e.target.value)} />
        </Form.Item>
        <Form.Item label="bar">
          <Input defaultValue={read('bar')} onChange={e => write('bar', e.target.value)} />
        </Form.Item>
        <Spin spinning={isUpdating('tic')}>
          <Form.Item label="tic">
            <Input value={read('tic')} disabled />
          </Form.Item>
        </Spin>
        <Spin spinning={isUpdating('tac')}>
          <Form.Item label="tac">
            <Input value={read('tac')} disabled />
          </Form.Item>
        </Spin>
        <Spin spinning={isUpdating('toe')}>
          <Form.Item label="toe">
            <Input value={read('toe')} disabled />
          </Form.Item>
        </Spin>
        <TimeSeries />
      </Form>
    )}
  />,
  document.getElementById('container'),
);
