import React from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';

export default function FormField({
  label,
  value,
}) {
  return (
    <Form.Item label={label}>
      <Input value={value} disabled />
    </Form.Item>
  );
}

FormField.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
};

FormField.defaultProps = {
  value: '',
};
