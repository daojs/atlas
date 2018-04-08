import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class PlainData extends PureComponent {
  render() {
    return (
      <div>
        {JSON.stringify(this.props.value)}
      </div>);
  }
}


PlainData.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.objectOf(PropTypes.any),
  ]),
};

PlainData.defaultProps = {
  value: {},
};
