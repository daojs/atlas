import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

export default function Cell({
  input,
  output,
  renderCell,
}, {
  read,
  write,
  isUpdating,
}) {
  return (
    <Spin spinning={input ? isUpdating(input) : false}>
      {renderCell({
        value: read(input || output),
        currentValue: read(output),
        update: value => output && write(output, value),
      })}
    </Spin>
  );
}

Cell.propTypes = {
  input: PropTypes.string,
  output: PropTypes.string,
  renderCell: PropTypes.func.isRequired,
};

Cell.defaultProps = {
  input: undefined,
  output: undefined,
};

Cell.contextTypes = {
  read: PropTypes.func,
  write: PropTypes.func,
  isUpdating: PropTypes.func,
};
