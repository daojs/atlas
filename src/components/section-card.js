import React, { PureComponent } from 'react';
import PropTypes, { any } from 'prop-types';
import { Card } from 'antd';

export default class SectionCard extends PureComponent {
  render() {
    return (
      <Card
        title={this.props.title}
      >
        {this.props.children}
      </Card>
    );
  }
}

SectionCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.arrayOf(any),
};

SectionCard.defaultProps = {
  title: '',
  children: [],
};
