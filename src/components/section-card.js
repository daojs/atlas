import React, { PureComponent } from 'react';
import PropTypes, { any } from 'prop-types';
import { Card } from 'antd';

export default class SectionCard extends PureComponent {
  render() {
    return (
      <div
        {...this.props}
      >
        <Card
          title={this.props.title}
          extra={this.props.extra || this.props.extras}
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'move',
          }}
          bodyStyle={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            role="presentation"
            onMouseDown={(e) => { e.stopPropagation(); }}
            onMouseUp={(e) => { e.stopPropagation(); }}
            style={{
              cursor: 'initial',
              flex: 1,
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
  children: PropTypes.node,
  title: PropTypes.string,
  extra: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.objectOf(any),
};

SectionCard.defaultProps = {
  children: [],
  extra: null,
  title: '',
  className: '',
  style: {},
};
