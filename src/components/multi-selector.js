import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import _ from 'lodash';

const { Option } = Select;

export default class MultiSelector extends Component {
  componentDidUpdate() {
    const {
      value: {
        defaultValue,
        enums,
      },
      currentValue,
    } = this.props;
    if (enums.length > 0) {
      if (_.isNil(currentValue)) {
        this.onChange(defaultValue);
      } else {
        const values = _.filter(
          currentValue,
          val => _.includes(enums, val) || _.find(enums, { value: val }),
        );
        if (!_.isEqual(values, currentValue)) {
          this.onChange(values);
        }
      }
    }
  }

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
  currentValue: PropTypes.arrayOf(PropTypes.string),
  update: PropTypes.func,
};

MultiSelector.defaultProps = {
  label: '',
  update: _.noop,
  value: { defaultValue: [], enums: [] },
  currentValue: undefined,
};
