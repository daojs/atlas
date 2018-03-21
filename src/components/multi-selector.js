import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import _ from 'lodash';

const { Option } = Select;

export default class MultiSelector extends Component {
  onChange(value) {
    this.props.update(value);
  }

  render() {
    const {
      defaultValue,
      enums,
    } = this.props.value;
    const opts = _.map(enums, item => ({ value: item.value || item, text: item.text || item }));
    const selector = enums.length > 0 ? (
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
      </Select>) : null;
    return (
      <div>
        {this.props.label}
        {selector}
      </div>);
  }
}

MultiSelector.propTypes = {
  label: PropTypes.string,
  value: PropTypes.objectOf(PropTypes.any),
  update: PropTypes.func,
};

MultiSelector.defaultProps = {
  label: '',
  update: _.noop,
  value: { defaultValue: [], enums: [] },
};
