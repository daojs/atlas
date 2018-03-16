import ReactDOM from 'react-dom';
import React from 'react';
import StoryBoard from './story-board';
import sampleStory from './sample-story';
import components from './components';

ReactDOM.render(
  <StoryBoard
    components={components}
    story={sampleStory}
    renderContent={() => null}
  />,
  document.getElementById('container'),
);
