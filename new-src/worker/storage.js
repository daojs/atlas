import uuid from 'uuid/v4';

class Storage {
  constructor() {
    this.tables = {};
  }

  write(data) {
    const id = uuid();

    this.tables[id] = data;
    return id;
  }

  read(id) {
    return this.tables[id];
  }

  remove(id) {
    delete this.tables[id];
  }
}

export default new Storage();
