import React, { PureComponent } from 'react';
import MD from 'react-markdown';
import PropTypes from 'prop-types';

export default class Markdown extends PureComponent {
  render() {
    return <MD source={this.props.value} />;
  }
}


Markdown.propTypes = {
  value: PropTypes.string,
};

Markdown.defaultProps = {
  value: '',
};

