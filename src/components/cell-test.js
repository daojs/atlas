import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import Promise from 'bluebird';

Promise.config({
  cancellation: true,
});

export default class CellTest extends Component {
  state = {
    isFetching: false,
    value: {},
  }

  componentDidMount() {
    if (this.props.input) {
      this.context.dataSource.register(this.props.id, this.props.input);
    }

    this.context.dataSource.addListener(this.props.id, this.fetchData);
    this.fetchData();
  }

  componentWillUnmount() {
    this.context.dataSource.removeEventListener(this.props.id);
    if (this.props.input) {
      this.context.dataSource.unRegister(this.props.id);
    }

    _.each(this.promiseCalls, call => call.cancel());
  }

  promiseCalls = {};

  fetchData = () => {
    this.setState({
      isFetching: true,
    });
    // fetch data from worker
    this.promiseCalls.read = this.context.dataSource.read(this.props.input || this.props.output)
      .then((data) => {
        this.setState({
          value: data,
          isFetching: false,
        });
      });
  }

  updateData = (value) => {
    this.promiseCalls.write = this.context.dataSource.write(this.props.output, value);
  }

  render() {
    const {
      input,
      output,
      Control,
      ...otherProps
    } = this.props;

    if (_.isEmpty(this.state.value)) {
      return null;
    }
    if (!input && !output) {
      return <Control {...otherProps} />;
    }

    return (
      <Spin spinning={this.state.isFetching}>
        <Control
          value={this.state.value}
          {...otherProps}
          update={this.updateData}
        />
      </Spin>
    );
  }
}

CellTest.propTypes = {
  input: PropTypes.string,
  output: PropTypes.string,
  Control: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

CellTest.defaultProps = {
  input: undefined,
  output: undefined,
};

CellTest.contextTypes = {
  dataSource: PropTypes.object,
};
