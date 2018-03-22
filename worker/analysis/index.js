import _ from 'lodash';
import moment from 'moment';
import Logger from '../sodexo-simulator/logger';

function createDateFilter(descriptor, format) {
  const { from, to } = descriptor;
  const momentFrom = moment(from);
  const momentTo = moment(to);

  return (value) => {
    const m = moment(value, moment.ISO_8601);
    return m && m.isValid() && m.isBetween(momentFrom, momentTo) ? m.format(format) : null;
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
    if (descriptor.type === 'days') {
      return createDateFilter(descriptor, 'YYYY-MM-DD');
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
  const keys = _.keys(dimensions);
  const filters = _.mapValues(dimensions, createScalarFilter);
  const filter = (item) => {
    const vec = _.map(keys, key => filters[key](item[key]));

    return _.every(vec) ? JSON.stringify(vec) : null;
  };

  return { keys, filter };
}

export function query({
  data,
  // metrics,
  dimensions,
  // orderBy,
  // top,
  // offset,
}) {
  const { id, name } = data;
  const table = Logger.read(id)[name];
  const results = {};
  const { keys, filter } = createVectorFilter(dimensions);

  _.forEach(table, (item) => {
    const key = filter(item);

    if (key) {
      if (!_.has(results, key)) {
        results[key] = [];
      }
      results[key].push(item);
    }
  });

  return results;
}