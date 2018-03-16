import React from 'react';
import PropTypes from 'prop-types';
import CalculateNetwork from './calculation-network';

export default class StoryBoard extends React.Component {
  constructor(props) {
    super(props);
    const {
      story: {
        parameters,
        cells,
      },
      renderContent,
    } = props;

    this.calculateNetwork = new CalculateNetwork({
      parameters,
      cells,
      willRecalculate: key => console.log(`Will recalc ${key}`),
      didRecalculate: key => console.log(`Did recalc ${key}`),
    });
    this.renderContent = renderContent;
  }

  render() {
    return this.renderContent();
  }
}

StoryBoard.propTypes = {
  story: PropTypes.shape({
    parameters: PropTypes.objectOf(PropTypes.shape({
      default: PropTypes.any,
    })),

    cells: PropTypes.objectOf(PropTypes.shape({
      dependencies: PropTypes.arrayOf(PropTypes.string),
      factory: PropTypes.func,
    })),
  }).isRequired,
  renderContent: PropTypes.func.isRequired,
};
