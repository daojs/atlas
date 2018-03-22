import _ from 'lodash';
import Promise from 'bluebird';
import uuid from 'uuid/v4';

export default class CalculationNetwork {
  constructor({
    parameters,
    cells,
    willRecalculate = _.noop,
    didRecalculate = _.noop,
  }) {
    this.parameters = _.mapKeys(parameters, (val, key) => `@${key}`);
    this.cells = cells;
    this.willRecalculate = willRecalculate;
    this.didRecalculate = didRecalculate;
    this.results = _.defaults({}, _.mapValues(this.parameters, _.property('default')), _.mapValues(cells, _.constant(null)));
    this.dirtyFlags = _.mapValues(this.results, _.constant(true));
    this.dependents = {};
    _.forEach(cells, ({ dependencies = [] }, key) => {
      _.forEach(dependencies, (dep) => {
        this.dependents[dep] = this.dependents[dep] || [];
        this.dependents[dep].push(key);
      });
    });
    this.latestTaskRecord = {};
    setTimeout(() => this.recalculate(), 0);
  }

  /**
   * TODO: cache it or calculate it in constructor if not support add cell dynamically
  */
  recalculateKeys() {
    const set = {};
    const inSet = _.propertyOf(set);
    const addKeys = (keys) => {
      _.chain(keys)
        .reject(inSet)
        .forEach((key) => {
          set[key] = true;
          addKeys(this.dependents[key]);
        })
        .value();
    };

    addKeys(_.keys(this.dirtyFlags));
    return _.filter(_.keys(set), _.propertyOf(this.cells));
  }

  recalculate() {
    const taskId = uuid();
    const expandedKeys = this.recalculateKeys();
    const results = _.mapValues(_.omit(this.results, expandedKeys), Promise.resolve);
    let remainingKeys = expandedKeys;

    delete this.dirtyFlags;

    this.latestTaskRecord = {
      ...this.latestTaskRecord,
      ..._.zipObject(remainingKeys, _.fill(new Array(remainingKeys.length), taskId)),
    };

    while (remainingKeys.length > 0) {
      const remainingKeysNew = [];
      _.forEach(remainingKeys, (key) => {
        const {
          dependencies = [],
          factory,
        } = this.cells[key];
        const depResults = _.map(dependencies, _.propertyOf(results));

        if (_.every(depResults, Boolean)) {
          this.willRecalculate({ key, taskId });
          results[key] = Promise
            .all(depResults)
            .spread(factory)
            .then((value) => {
              const isAbandoned = this.latestTaskRecord[key] !== taskId;
              if (!isAbandoned) {
                this.results[key] = value;
              }
              this.didRecalculate({
                key,
                taskId,
                value,
                isAbandoned,
              });
              return value;
            }, (error) => {
              this.didRecalculate({
                key,
                taskId,
                error,
                isAbandoned: this.latestTaskRecord[key] !== taskId,
              });
            });
        } else {
          remainingKeysNew.push(key);
        }
      });
      remainingKeys = remainingKeysNew;
    }
  }

  write(key, value) {
    if (_.has(this.parameters, key) && value !== this.results[key]) {
      this.results[key] = value;
      if (!this.dirtyFlags) {
        this.dirtyFlags = {};
        setTimeout(() => this.recalculate(), 0);
      }
      this.dirtyFlags[key] = value;
    }
  }

  read(key) {
    return this.results[key];
  }
}
