import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import _ from 'lodash';

const { Option } = Select;

export default class SingleSelector extends Component {
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
        const isValueAvailable = _.includes(enums, currentValue)
          || _.find(enums, { value: currentValue });
        if (!isValueAvailable) {
          this.onChange(defaultValue);
        }
      }
    }
  }

  onChange(value) {
    setTimeout(() => this.props.update(value), 0);
  }

  render() {
    const {
      defaultValue,
      enums,
    } = this.props.value;
    const opts = _.map(enums, item => ({ value: item.value || item, text: item.text || item }));
    const selector = enums.length > 0 ? (
      <Select
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

SingleSelector.propTypes = {
  label: PropTypes.string,
  value: PropTypes.objectOf(PropTypes.any),
  currentValue: PropTypes.string,
  update: PropTypes.func,
};

SingleSelector.defaultProps = {
  label: '',
  update: _.noop,
  value: { defaultValue: undefined, enums: [] },
  currentValue: undefined,
};
