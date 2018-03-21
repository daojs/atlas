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
    <Spin spinning={isUpdating(input)}>
      {renderCell({ value: read(input), update: write(output) })}
    </Spin>
  );
}

Cell.propTypes = {
  input: PropTypes.string.isRequired,
  output: PropTypes.string.isRequired,
  renderCell: PropTypes.func.isRequired,
};

Cell.contextTypes = {
  read: PropTypes.func,
  isUpdating: PropTypes.func,
};

