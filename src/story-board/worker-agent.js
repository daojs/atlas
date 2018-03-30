import _ from 'lodash';
import Promise from 'bluebird';
import client from '../mock/worker';

export default class WorkerAgent {
  constructor() {
    this.observers = {};
  }

  addObserver(key) {
  }

  read(key) {
    return client.call('get', key);
  }

  write(key, value) {
    return client.call('set', key, value);
  }
}
