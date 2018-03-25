import React from 'react';
import { Form } from 'antd';
import 'antd/dist/antd.css';
import PropTypes, { any } from 'prop-types';
import _ from 'lodash';

import StoryBoard from '../story-board';
import components from '../components';

const {
  Cell,
} = components;

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

    const children = _.map(items, item => this.renderItem(item));
    const control = components[type];

    return (
      <Cell id={key} input={input} output={output} {...props} renderCell={WithComponent(control)}>
        {children}
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
      renderComponent={() => (
        <Form>
          {this.renderItem(layout)}
        </Form>
      )}
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
