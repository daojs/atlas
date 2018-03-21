import React, { Component } from 'react';
import PropTypes, { any } from 'prop-types';
import _ from 'lodash';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { getLayout, setLayout } from '../repository';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const rowHeight = 30; // px
const marginX = 10; // px
const marginY = 10; // px

const sectionHeight = (layout, sectionId) => {
  const sectionLayout = _.find(layout, { i: sectionId.toString() }) || {};
  const rows = _.get(sectionLayout, 'h', 0);
  const height = (rows * (rowHeight + marginY)) - marginY;
  return `${_.max([height, 0])}px`;
};

export default class ResponsiveContainer extends Component {
  constructor(props) {
    super(props);

    /* eslint-disable immutable/no-mutation */
    this.state = {
      layout: [],
    };
    /* eslint-enable */
  }

  componentDidMount() {
    getLayout({
      storyId: this.props.key,
      sectionIds: _.map(this.props.children, child => _.get(child, 'props.key')),
    }).then((layout) => {
      this.setState({ layout });
    });
  }

  onLayoutChange(newLayout) {
    this.setState({ layout: newLayout });
  }

  saveLayout(newLayout) {
    setLayout({
      storyId: this.props.key,
      storyLayout: newLayout,
    });
  }

  render() {
    return (
      <React.Fragment>
        <ResponsiveReactGridLayout
          className="layout"
          layouts={{ lg: this.state.layout }}
          breakpoints={{ lg: 1200 }}
          cols={{ lg: 12 }}
          rowHeight={rowHeight}
          margin={[marginX, marginY]}
          onDrag={this.onLayoutChange}
          onResize={this.onLayoutChange}
          onDragStop={this.saveLayout}
          onResizeStop={this.saveLayout}
        >
          {React.Children.map(this.props.children, child =>
            React.cloneElement(child, {
              style: { height: sectionHeight(this.state.layout, child.props.key) },
          }))}
        </ResponsiveReactGridLayout>
      </React.Fragment>);
  }
}

ResponsiveContainer.propTypes = {
  key: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(any),
};

ResponsiveContainer.defaultProps = {
  children: [],
};
