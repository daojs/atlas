import React from 'react';
import _ from 'lodash';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import client from '../mock/worker';
import components from '../components';

const {
  CellTest,
} = components;

function extractInputs(nodes) {
  return _.reduce(nodes, (memo, { input, items }) => {
    if (input && !_.includes(memo, input)) {
      return [...memo, ...extractInputs(items), input];
    }
    return [...memo, ...extractInputs(items)];
  }, []);
}

export default class StoryBoardTest extends React.Component {
  state = {
    data: Map(),
    updating: Map(),
  }

  componentDidMount() {
    const { layout } = this.props;
    const inputs = extractInputs(_.isArray(layout) ? layout : [layout]);
    this.setState({ //eslint-disable-line
      updating: Map(_.zipObject(inputs, _.fill(Array(inputs.length), true))),
    });

    this.fetchData(inputs);
  }

  fetchData = (inputs) => {
    _.forEach(inputs, async (input) => {
      const value = await client.call('get', input);

      this.setState(({
        data,
        updating,
      }) => ({
        data: data.set(input, value),
        updating: updating.set(input, false),
      }));
    });
  }

  update = async (key, value) => {
    const invalidateKeys = await client.call('set', key, value);
    this.setState(({
      data,
      updating,
    }) => {
      _.forEach(invalidateKeys, (invalidateKey) => {
        updating = updating.set(invalidateKey, true); //eslint-disable-line
      });

      return {
        data,
        updating,
      };
    });

    this.fetchData(invalidateKeys);
  }

  renderItem(config) {
    const {
      key,
      input,
      output,
      type,
      props = {},
      items = [],
    } = config;

    return (
      <div key={key}>
        <CellTest
          id={key}
          input={input}
          output={output}
          Control={components[type]}
          data={this.state.data.get(input)}
          isUpdating={this.state.updating.get(input)}
          update={this.update}
          {...props}
        >
          {_.map(items, item => this.renderItem(item))}
        </CellTest>
      </div>
    );
  }

  render() {
    return this.renderItem(this.props.layout);
  }
}

StoryBoardTest.propTypes = {
  layout: PropTypes.objectOf(PropTypes.any).isRequired,
};
