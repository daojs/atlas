import _ from 'lodash';
import uuid from 'uuid/v4';

const logs = {};

export default class Logger {
  constructor() {
    this.id = uuid();
    this.logs = {};
    logs[this.id] = this.logs;
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
    return logger.id;
  }

  static remove(id) {
    delete logs[id];
  }

  static read(id) {
    return logs[id];
  }
}
