import React from 'react';
import Layout from '../story-board/layout';
import story from './story';
import config from './layout.config';

export default function () {
  return (<Layout story={story} layout={config} />);
}
