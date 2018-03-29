import React from 'react';
import PropTypes from 'prop-types';
import WorkerAgent from './worker-agent';

export default class StoryBoardTest extends React.Component {
  getChildContext() {
    return {
      dataSource: this.workerAgent,
    };
  }

  workerAgent = new WorkerAgent();

  render() {
    return this.props.renderComponent();
  }
}

StoryBoardTest.propTypes = {
  renderComponent: PropTypes.func.isRequired,
};

StoryBoardTest.childContextTypes = {
  dataSource: PropTypes.object,
};
