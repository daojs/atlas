import React from 'react';
import _ from 'lodash';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import client from '../../rpc-client/index';
import components from '../components';
import Layout from '../layout';

function extractInputs(nodes) {
  return _.reduce(nodes, (memo, { input, items }) => {
    if (input && !_.includes(memo, input)) {
      return [...memo, ...extractInputs(items), input];
    }
    return [...memo, ...extractInputs(items)];
  }, []);
}

export default class StoryBoard extends React.Component {
  constructor(props) {
    super(props);

    const inputs = this.inputNodes;
    this.state = {
      data: Map(),
      updating: Map(_.zipObject(inputs, _.fill(Array(inputs.length), true))),
    };
  }

  componentDidMount() {
    this.fetchData(this.inputNodes);
  }

  get inputNodes() {
    const { layout } = this.props;
    return extractInputs(_.isArray(layout) ? layout : [layout]);
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
    const invalidateNodes = _.intersection(invalidateKeys, this.inputNodes);

    this.setState(({
      data,
      updating,
    }) => ({
      data,
      updating: updating.merge(_.zipObject(invalidateNodes, _.fill(Array(invalidateNodes.length), true))), //eslint-disable-line
    }));

    this.fetchData(invalidateNodes);
  }

  render() {
    return (<Layout
      componentRegistry={components}
      layout={this.props.layout}
      data={this.state.data}
      isUpdating={this.state.updating}
      update={this.update}
    />);
  }
}

StoryBoard.propTypes = {
  layout: PropTypes.objectOf(PropTypes.any).isRequired,
};
