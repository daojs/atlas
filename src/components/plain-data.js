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
  value: PropTypes.objectOf(PropTypes.any),
};

PlainData.defaultProps = {
  value: {},
};
