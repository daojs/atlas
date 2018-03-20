import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

export default function Cell({
  parameter,
  renderCell,
}, {
  read,
  isUpdating,
}) {
  return (
    <Spin spinning={isUpdating(parameter)}>
      {renderCell({ value: read(parameter) })}
    </Spin>
  );
}

Cell.propTypes = {
  parameter: PropTypes.string.isRequired,
  renderCell: PropTypes.func.isRequired,
};

Cell.contextTypes = {
  read: PropTypes.func,
  isUpdating: PropTypes.func,
};

