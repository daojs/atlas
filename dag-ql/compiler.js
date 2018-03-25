import _ from 'lodash';
import Promise from 'bluebird';

import CalculationNetwork from './calculation-network';

export default class Compiler {
  constructor(procs) {
    this.procs = procs;
  }

  compileClause(clause, deps) {
    if (_.isArray(clause)) {
      return this.compileArrayClause(clause, deps);
    }
    if (_.isObject(clause)) {
      return this.compileObjectClause(clause, deps);
    }
    return _.constant(clause);
  }

  compileArrayClause(clause, deps) {
    const clauses = _.map(clause, c => this.compileClause(c, deps));
    return context => Promise.all(_.map(clauses, c => c(context)));
  }

  compileObjectClause(clause, deps) {
    if (_.isString(clause['@ref'])) {
      deps.add(clause['@ref']);
      return _.property(clause['@ref']);
    }
    if (_.isString(clause['@proc'])) {
      const proc = this.procs[clause['@proc']];
      const parameters = this.compileArrayClause(clause['@args'], deps);

      return context => parameters(context).then(args => proc(...args));
    }
    const clauses = _.mapValues(clause, c => this.compileClause(c, deps));

    return context => Promise.props(_.mapValues(clauses, c => c(context)));
  }

  compileNode(clause) {
    const deps = new Set();
    const factory = this.compileClause(clause, deps);

    return {
      dependencies: Array.from(deps),
      factory,
    };
  }

  compile(ql) {
    return new CalculationNetwork(_.mapValues(ql, node => this.compileNode(node)));
  }
}
