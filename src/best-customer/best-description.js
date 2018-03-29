import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class PlainData extends PureComponent {
  render() {
    return (
      <div>
        <h3>
          The best department is: {this.props.value.department}
        </h3>
        <h3>
          The best discipline is: {this.props.value.discipline}
        </h3>
      </div>
    );
  }
}


PlainData.propTypes = {
  value: PropTypes.objectOf(PropTypes.any),
};

PlainData.defaultProps = {
  value: {},
};
