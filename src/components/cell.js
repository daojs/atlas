import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

export default function Cell({
  input,
  output,
  renderCell,
  ...otherProps
}, {
  read,
  write,
  isUpdating,
}) {
  if (!input && !output) {
    return renderCell({ ...otherProps });
  }
  return (
    <Spin spinning={input ? isUpdating(input) : false}>
      {read(input || output) ? renderCell({
        ...otherProps,
        value: read(input || output),
        currentValue: read(output),
        update: value => output && write(output, value),
      }) : null}
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
