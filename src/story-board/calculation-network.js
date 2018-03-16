import _ from 'lodash';
import Promise from 'bluebird';

export default class CalculationNetwork {
  constructor({
    parameters,
    cells,
    willRecalculate = _.noop,
    didRecalculate = _.noop,
  }) {
    this.parameters = parameters;
    this.cells = cells;
    this.willRecalculate = willRecalculate;
    this.didRecalculate = didRecalculate;
    this.results = _.assign(_.mapValues(cells, _.constant(null)), parameters);
    this.dependents = {};
    _.forEach(cells, ({ dependencies }, key) => {
      _.forEach(dependencies, (dep) => {
        this.dependents[dep] = this.dependents[dep] || [];
        this.dependents[dep].push(key);
      });
    });
    this.recalculate(_.keys(cells));
  }

  recalculateKeys(originalKeys) {
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

    addKeys(originalKeys);
    return _.filter(_.keys(set), _.propertyOf(this.cells));
  }

  recalculate(keys) {
    const expandedKeys = this.recalculateKeys(keys);
    const results = _.mapValues(_.omit(this.results, expandedKeys), Promise.resolve);
    let remainingKeys = expandedKeys;

    while (remainingKeys.length > 0) {
      const remainingKeysNew = [];
      _.forEach(remainingKeys, (key) => {
        const {
          dependencies,
          factory,
        } = this.cells[key];
        const depResults = _.map(dependencies, _.propertyOf(results));

        if (_.every(depResults, Boolean)) {
          this.willRecalculate(key);
          results[key] = Promise.all(depResults).spread(factory).finally(() => {
            this.didRecalculate(key);
          });
        } else {
          remainingKeysNew.push(key);
        }
      });
      remainingKeys = remainingKeysNew;
    }
  }
}
