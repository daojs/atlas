import _ from 'lodash';
import Promise from 'bluebird';
import uuid from 'uuid/v4';

export default class RpcClient {
  constructor(src) {
    this.worker = new Worker(src);
    this.pendingCalls = {};
    this.worker.onmessage = (event) => {
      const [id, error, result] = event.data;

      if (!_.isString(id)) {
        throw new Error(`Invalid worker procedure call id ${id}`);
      }

      if (this.pendingCalls[id]) {
        const [resolve, reject] = this.pendingCalls[id];

        delete this.pendingCalls[id];
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      }
    };
  }

  call(name, ...parameters) {
    return new Promise((resolve, reject) => {
      const id = uuid();

      this.pendingCalls[id] = [resolve, reject];
      this.worker.postMessage([id, name, ...parameters]);
    });
  }
}
