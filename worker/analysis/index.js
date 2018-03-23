import _ from 'lodash';
import moment from 'moment';
import storage from '../storage';

function createDateFilter(descriptor, format) {
  const { from, to } = descriptor;
  const momentFrom = from && moment(from);
  const momentTo = to && moment(to);

  return (value) => {
    const m = moment(value, moment.ISO_8601);

    if (!m || !m.isValid()) {
      return null;
    }

    if (momentFrom && momentFrom.isValid() && m.isBefore(momentFrom)) {
      return null;
    }

    if (momentTo && momentTo.isValid() && m.isSameOrAfter(momentTo)) {
      return null;
    }

    return _.isFunction(format) ? format(m) : m.format(format);
  };
}

function createBinsFilter(descriptor) {
  const { step, offset = 0 } = descriptor;

  return (value) => {
    const from = (Math.floor((value - offset) / step) * step) + offset;
    const to = from + step;

    return `${from} - ${to}`;
  };
}

function createScalarFilter(descriptor) {
  if (_.isObject(descriptor)) {
    if (descriptor.type === 'any') {
      return _.identity;
    }
    if (descriptor.type === 'time') {
      return createDateFilter(descriptor, _.constant(true));
    }
    if (descriptor.type === 'days') {
      return createDateFilter(descriptor, 'YYYY-MM-DD');
    }
    if (descriptor.type === 'weeks') {
      return createDateFilter(descriptor, 'YYYY-[W]WW');
    }
    if (descriptor.type === 'months') {
      return createDateFilter(descriptor, 'YYYY-MM');
    }
    if (descriptor.type === 'years') {
      return createDateFilter(descriptor, 'YYYY');
    }
    if (descriptor.type === 'bins') {
      return createBinsFilter(descriptor);
    }
  }

  if (_.isArray(descriptor)) {
    return value => (_.includes(descriptor, value) ? value : null);
  }

  return value => (value === descriptor ? value : null);
}

function createVectorFilter(dimensions) {
  const filterDims = _.keys(dimensions);
  const filters = _.mapValues(dimensions, createScalarFilter);
  const filter = (item) => {
    const vec = _.map(filterDims, key => filters[key](item[key]));

    return _.every(vec) ? JSON.stringify(vec) : null;
  };

  return { filterDims, filter };
}

const aggrs = {
  sum: _.sum,
  average: values => _.sum(values) / values.length,
  count: values => _.uniq(values).length,
};

export function reduce(id, {
  metrics,
  dimensions,
}) {
  const table = storage.read(id);
  const results = {};
  const { filterDims, filter } = createVectorFilter(dimensions);
  const metricsDims = _.keys(metrics);

  _.forEach(table, (item) => {
    const key = filter(item);

    if (key) {
      if (!_.has(results, key)) {
        results[key] = [];
      }
      results[key].push(item);
    }
  });


  const columns = filterDims.concat(metricsDims);

  return storage.write(_.map(results, (items, key) => {
    const row = JSON.parse(key);

    row.push(..._.map(metricsDims, dim => aggrs[metrics[dim]](_.map(items, dim))));
    return _.zipObject(columns, row);
  }));
}

export { query } from './query';
