import _ from 'lodash';
import Bar from './bar';

export default class HorizontalBar extends Bar {
  getOption() {
    const rawOption = super.getOption();
    return _.defaults({
      xAxis: rawOption.yAxis,
      yAxis: rawOption.xAxis,
    }, rawOption);
  }
}
