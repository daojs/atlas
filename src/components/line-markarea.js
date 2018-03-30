import _ from 'lodash';
import Line from './line';


export default class LineWithMarkArea extends Line {
  getSeriesOption() {
    const rawOption = super.getSeriesOption();
    const {
      markArea,
    } = this.props.value;

    if (markArea) {
      return [
        _.defaults({
          markArea: {
            data: markArea,
          },
        }, rawOption[0]),
        ...rawOption.slice(1),
      ];
    }
    return rawOption;
  }
}
