import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import _ from 'lodash';

export default class DataCard extends PureComponent {
  render() {
    return (
      <div>
        <Card
          title={this.props.label}
        >
          <p>{JSON.stringify(this.props.value)}</p>
        </Card>
      </div>);
  }
}


DataCard.propTypes = {
  label: PropTypes.string,
  value: PropTypes.objectOf(PropTypes.any),
};

DataCard.defaultProps = {
  label: '',
  value: {},
};
