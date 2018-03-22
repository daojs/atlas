import _ from 'lodash';
import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import CalculationNetwork from './calculation-network';

export default class StoryBoard extends React.Component {
  constructor(props) {
    super(props);
    const {
      story: {
        parameters,
        cells,
      },
    } = props;

    this.state = {
      results: Immutable.Map(_.mapValues(_.mapKeys(parameters, (val, key) => `@${key}`), _.property('default'))),
      updating: Immutable.Map(),
    };

    this.calculationNetwork = new CalculationNetwork({
      parameters,
      cells,
      willRecalculate: ({ key }) => {
        this.setState(({ updating }) => ({
          updating: updating.set(key, true),
        }));
      },
      didRecalculate: ({ key, value, isAbandoned }) => {
        if (!isAbandoned) {
          this.setState(({
            results,
            updating,
          }) => ({
            results: results.set(key, value),
            updating: updating.set(key, false),
          }));
        }
      },
    });
  }

  getChildContext() {
    return {
      read: key => this.state.results.get(key),
      isUpdating: key => this.state.updating.get(key),
      write: (key, value) => {
        this.calculationNetwork.write(key, value);
        this.setState(({ results }) => ({
          results: results.set(key, value),
        }));
      },
    };
  }

  render() {
    return this.props.renderComponent();
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
  renderComponent: PropTypes.func.isRequired,
};

StoryBoard.childContextTypes = {
  read: PropTypes.func,
  write: PropTypes.func,
  isUpdating: PropTypes.func,
};
