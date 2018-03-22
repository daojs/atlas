import _ from 'lodash';
import storage from '../storage';

export default class Logger {
  constructor() {
    this.logs = {};
  }

  log(key, data) {
    if (!_.isArray(this.logs[key])) {
      this.logs[key] = [];
    }
    this.logs[key].push(data);
  }

  static record(callback) {
    const logger = new Logger();

    callback(logger);

    return _.mapValues(logger.logs, logs => storage.write(logs));
  }
}
