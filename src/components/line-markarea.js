import _ from 'lodash';
import Line from './line';


export default class LineWithMarkArea extends Line {
  getSeriesOption() {
    const rawOption = super.getSeriesOption();
    const {
      markLine,
      markArea,
    } = this.props.value;


    return [
      _.defaults({
        markLine: {
          symbolSize: 0,
          data: markLine || [],
        },
        markArea: {
          data: markArea || [],
        },
      }, rawOption[0]),
      ...rawOption.slice(1),
    ];
  }
}
