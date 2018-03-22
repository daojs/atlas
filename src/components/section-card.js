import React, { PureComponent } from 'react';
import PropTypes, { any } from 'prop-types';
import { Card } from 'antd';
import _ from 'lodash';

export default class SectionCard extends PureComponent {
  render() {
    return (
      <div
        {...this.props}
      >
        <Card
          title={this.props.title}
          style={{
            cursor: 'move',
          }}
        >
          <div
            role="presentation"
            onMouseDown={(e) => { e.stopPropagation(); }}
            onMouseUp={(e) => { e.stopPropagation(); }}
            style={{
              cursor: 'initial',
            }}
          >
            {this.props.children}
          </div>
        </Card>
      </div>
    );
  }
}

SectionCard.propTypes = {
  children: PropTypes.arrayOf(any),
  title: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.objectOf(any),
};

SectionCard.defaultProps = {
  children: [],
  title: '',
  className: '',
  style: {},
};
