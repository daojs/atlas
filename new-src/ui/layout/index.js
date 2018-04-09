import React from 'react';
import StoryBoard from '../story-board/index';
import config from './config';

export default function Layout() {
  return (<StoryBoard layout={config} />);
}
