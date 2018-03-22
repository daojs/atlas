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
  const rows = _.get(sectionLayout, 'h', 4);
  const height = (rows * (rowHeight + marginY)) - marginY;
  return `${_.max([height, 0])}px`;
};

// const sectionPadding = 12; // px

// const styles = {
//   section: {
//     pposition: 'relative',
//     border: '1px solid #eee',
//     padding: `${sectionPadding}px`,
//     boxSizing: 'border-box',
//   },
//   sectionHover: {
//     boxShadow: '0 0 5px #aaa',
//     cursor: 'move',
//   },
//   resizerMark: {
//     position: 'absolute',
//     right: 1,
//     bottom: 1,
//     marginTop: `-${sectionPadding}px`,
//     marginLeft: `-${sectionPadding}px`,
//     width: `${sectionPadding}px`,
//     height: `${sectionPadding}px`,
//     backgroundColor: '#fff',
//     zIndex: 10,
//   },
// };

export default class SectionContainer extends Component {
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
      storyId: this.props.id,
      sectionIds: _.map(this.props.children, child => child.key),
    }).then((layout) => {
      this.setState({ layout });
    });
  }

  onLayoutChange(newLayout) {
    this.setState({ layout: newLayout });
  }

  saveLayout(newLayout) {
    setLayout({
      storyId: this.props.id,
      storyLayout: newLayout,
    });
  }

  render() {
    return (
      <ResponsiveReactGridLayout
        className="layout"
        layouts={{ lg: this.state.layout }}
        breakpoints={{ lg: 1200 }}
        cols={{ lg: 12 }}
        rowHeight={rowHeight}
        margin={[marginX, marginY]}
        onDrag={args => this.onLayoutChange(args)}
        onResize={args => this.onLayoutChange(args)}
        onDragStop={args => this.saveLayout(args)}
        onResizeStop={args => this.saveLayout(args)}
      >
        {React.Children.map(this.props.children, child =>
          React.cloneElement(child, {
            style: {
              height: sectionHeight(this.state.layout, child.key),
            },
        }))}
      </ResponsiveReactGridLayout>
    );
  }
}

SectionContainer.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(any),
};

SectionContainer.defaultProps = {
  children: [],
};
