import React from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';

export default function FormInput({
  onChange,
  defaultValue,
  label,
}) {
  return (
    <Form.Item label={label}>
      <Input
        defaultValue={defaultValue}
        onChange={e => onChange(e.target.value)}
      />
    </Form.Item>
  );
}

FormInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  label: PropTypes.string.isRequired,
};

FormInput.defaultProps = {
  defaultValue: '',
};
