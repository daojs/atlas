import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import _ from 'lodash';

const { Option } = Select;

export default class MultiSelector extends Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.objectOf(PropTypes.any).isRequired,
    update: PropTypes.func,
  }

  static defaultProps = {
    label: '',
    update: _.noop,
  }

  onChange(value) {
    this.props.update(value);
  }

  render() {
    const {
      defaultValue,
      enums,
    } = this.props.value;
    const opts = _.map(enums, enum => ({ value: enum.value || enum, text: enum.text || enum }));
    return (
      <div>
        {this.props.label}
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          defaultValue={defaultValue}
          onChange={args => this.onChange(args)}
        >
          {_.map(opts, (opt) => {
            const { value: optKey, text } = opt;
            return (<Option key={optKey} value={optKey}>{text}</Option>);
          })}
        </Select>
      </div>);
  }
}
