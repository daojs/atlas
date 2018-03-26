import React from 'react';
import 'antd/dist/antd.css';
import PropTypes, { any } from 'prop-types';
import _ from 'lodash';

import StoryBoard from './index';
import components from '../components';

const { Cell } = components;

function WithComponent(Control) {
  return props => (Control ? (<Control {...props} />) : (<div {...props} />));
}

export default class Layout extends React.PureComponent {
  renderItem(config) {
    const {
      key,
      input,
      output,
      type,
      props = {},
      items = [],
    } = config;

    return (
      <Cell
        id={key}
        key={key}
        input={input}
        output={output}
        {...props}
        renderCell={WithComponent(components[type])}
      >
        {_.map(items, item => this.renderItem(item))}
      </Cell>
    );
  }

  render() {
    const {
      story,
      layout,
    } = this.props;
    return (<StoryBoard
      components={components}
      story={story}
      renderComponent={() => this.renderItem(layout)}
    />);
  }
}

Layout.propTypes = {
  story: PropTypes.objectOf(any),
  layout: PropTypes.objectOf(any),
};

Layout.defaultProps = {
  story: {},
  layout: {},
};
