import Line from './line';

export default class LineWithDataZoom extends Line {
  getOption() {
    return {
      ...super.getOption(),
      dataZoom: [{
        type: 'slider',
        showDataShadow: false,
        bottom: 10,
        height: 20,
        borderColor: 'transparent',
        backgroundColor: '#e2e2e2',
        handleSize: 20,
        handleStyle: {
          shadowBlur: 6,
          shadowOffsetX: 1,
          shadowOffsetY: 2,
          shadowColor: '#aaa',
        },
        labelFormatter: '',
      }, {
        type: 'inside',
      }],
    };
  }
}
