import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
import _ from 'lodash';

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

export default class TimeRangePickerTest extends PureComponent {
  componentDidMount() {
    this.onChange([
      moment(this.props.value.start, dateFormat),
      moment(this.props.value.end, dateFormat),
    ]);
  }

  onChange(values) {
    const [start, end] = values;
    const value = { start: start.format(dateFormat), end: end.format(dateFormat) };
    this.props.update(value);
  }

  render() {
    const { start, end } = this.props.value;
    return (
      <div>
        {this.props.label}
        <RangePicker
          defaultValue={[moment(start, dateFormat), moment(end, dateFormat)]}
          format={dateFormat}
          onChange={args => this.onChange(args)}
        />
      </div>);
  }
}

TimeRangePickerTest.propTypes = {
  value: PropTypes.objectOf(PropTypes.any),
  label: PropTypes.string,
  update: PropTypes.func,
};

TimeRangePickerTest.defaultProps = {
  label: '',
  update: _.noop,
  value: {},
};
