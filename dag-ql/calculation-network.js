import Promise from 'bluebird';
import _ from 'lodash';

export default class CalculationNetwork {
  constructor(graph) {
    this.dependencies = {};
    this.dependent = {};
    this.factories = {};
    this.cache = {};

    _.forEach(graph, ({ dependencies, factory }, key) => {
      _.forEach(dependencies, (dep) => {
        if (!_.has(this.dependent, dep)) {
          this.dependent[dep] = [];
        }
        this.dependent[dep].push(key);

        if (!_.has(this.dependencies, key)) {
          this.dependencies[key] = [];
        }
        this.dependencies[key].push(dep);
      });
      this.factories[key] = factory;
    });

    this.validateGraph();
  }

  validateGraph() {
    let g = _.clone(this.dependencies);

    function reduce(graph) {
      return _.pickBy(graph, deps => _.some(deps, dep => _.has(graph, dep)));
    }

    while (!_.isEmpty(g)) {
      const h = reduce(g);
      if (_.size(h) === _.size(g)) {
        throw new Error('Circular dependency');
      }
      g = h;
    }
  }

  set(key, value) {
    if (value !== this.cache[key]) {
      this.invalidate(key);
      this.cache[key] = Promise.resolve(value);
    }
  }

  get(key) {
    if (!_.has(this.cache, key)) {
      const deps = this.dependencies[key];
      const factory = this.factories[key] || (() => this.cache[key]);

      this.cache[key] = Promise
        .all(_.map(deps, dep => this.get(dep)))
        .then(values => factory(_.zipObject(deps, values)));
    }
    return this.cache[key];
  }

  invalidate(key) {
    if (_.has(this.cache, key)) {
      delete this.cache[key];
      _.forEach(this.dependent[key], dep => this.invalidate(dep));
    }
  }
}
