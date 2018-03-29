import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Radio } from 'antd';
import _ from 'lodash';

const { Option } = Select;

export default class SingleSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioSelectValue: '',
    };
  }

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
    this.props.update(value);
  }

  onSelectChange(value) {
    this.props.update(value);
  }

  onRadioChange(e) {
    this.props.update(e.target.value);
    this.setState({ radioSelectValue: e.target.value });
  }

  render() {
    const {
      defaultValue,
      enums,
    } = this.props.value;
    const opts = _.map(enums, item => ({ value: item.value || item, text: item.text || item }));
    const select = enums.length > 0 ? (
      <Select
        style={{ width: '100%', minWidth: '100px' }}
        defaultValue={defaultValue}
        onChange={args => this.onSelectChange(args)}
      >
        {_.map(opts, (opt) => {
          const { value: optKey, text } = opt;
          return (<Option key={optKey} value={optKey}>{text}</Option>);
        })}
      </Select>) : null;

    const radio = enums.length > 0 ? (
      <Radio.Group
        value={this.state.radioSelectValue || defaultValue}
        onChange={args => this.onRadioChange(args)}
      >
        {_.map(opts, (opt) => {
          const { value: optKey, text } = opt;
          return (<Radio.Button key={optKey} value={optKey}>{text}</Radio.Button>);
        })}
      </Radio.Group>
    ) : null;

    return this.props.selectType === 'radio' ? (
      <span>
        {radio}
      </span>
    ) : (
      <div>
        {this.props.label}
        {select}
      </div>
    );
  }
}

SingleSelector.propTypes = {
  selectType: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.objectOf(PropTypes.any),
  defaultValue: PropTypes.string,
  update: PropTypes.func,
};

SingleSelector.defaultProps = {
  selectType: 'radio',
  label: '',
  update: _.noop,
  value: { defaultValue: undefined, enums: [] },
  defaultValue: undefined,
};
