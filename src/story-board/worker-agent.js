import _ from 'lodash';
import Promise from 'bluebird';
import EventEmitter from 'wolfy87-eventemitter';
import client from '../mock/worker'; // Worker

export default class WorkerAgent {
  eventEmitter = new EventEmitter();

  keys2IdsMap = {};

  register(id, key) {
    if (this.keys2IdsMap[key]) {
      this.keys2IdsMap[key].push(id);
    }

    // key is input, id is cell identifies
    this.keys2IdsMap[key] = [id];
  }

  unRegister(id) {
    _.each(this.keys2IdsMap, value => _.remove(value, item => item === id));
  }

  addListener(eventName, listener) {
    this.eventEmitter.addListener(eventName, listener);
  }

  removeEventListener(eventName, listener) {
    this.eventEmitter.removeListener(eventName, listener);
  }

  emit(eventName, payload = {}, error = false) {
    this.eventEmitter.emitEvent(eventName, payload, error);
  }

  getEventEmitter() {
    return this.eventEmitter;
  }

  read = key => client.call('get', key)

  write(key, value) {
    client.call('set', key, value);

    Promise.resolve(client.call('getInvalidateList', key))
      .then((data) => {
        _.chain(data)
          .map(invalidateKey => this.keys2IdsMap[invalidateKey] || [])
          .flatten()
          .uniq()
          .each(id => this.emit(id))
          .value();
      });
  }
}
