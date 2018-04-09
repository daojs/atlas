import React, { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes, { any } from 'prop-types';
import { Spin } from 'antd';

export default class Cell extends PureComponent {
  updateData = (value) => {
    this.props.update(this.props.output, value);
  }

  render() {
    const {
      input,
      output,
      type,
      componentRegistry,
      data,
      ...otherProps
    } = this.props;

    const Control = _.isObject(componentRegistry) ? componentRegistry[type] : null;

    if (!Control) {
      return null;
    }

    if (!input && !output) {
      return <Control {...otherProps} />;
    }

    return (
      <Spin spinning={this.props.isUpdating}>
        <Control
          value={this.props.data}
          {...otherProps}
          update={this.updateData}
        />
      </Spin>
    );
  }
}

Cell.propTypes = {
  input: PropTypes.string,
  output: PropTypes.string,
  type: PropTypes.string.isRequired,
  componentRegistry: PropTypes.oneOfType([PropTypes.func, PropTypes.objectOf(any)]).isRequired,
  id: PropTypes.string.isRequired,
  isUpdating: PropTypes.bool,
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.any),
  ]),
  update: PropTypes.func,
};

Cell.defaultProps = {
  input: undefined,
  output: undefined,
  data: undefined,
  isUpdating: false,
  update: _.noop,
};

