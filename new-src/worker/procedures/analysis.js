import _ from 'lodash';
import moment from 'moment';
import storage from './storage';

function processAggregation(aggregation) {
  const aggrs = {
    sum: _.sum,
    average: values => _.sum(values) / values.length,
    count: values => _.uniq(values).length,
  };

  return items => _.mapValues(
    aggregation,
    (name, key) => aggrs[name](_.map(items, key)),
  );
}

function processRangeFilter({ from, to }) {
  if (_.isNumber(from)) {
    if (_.isNumber(to)) {
      return value => value >= from && value < to;
    }
    return value => value >= from;
  }
  if (_.isNumber(to)) {
    return value => value < to;
  }
  return _.constant(true);
}

function processTimeRangeFilter({ from, to }) {
  const momentFrom = moment(from);
  const momentTo = moment(to);

  if (momentFrom && momentFrom.isValid()) {
    if (momentTo && momentTo.isValid()) {
      return value => moment(value).isBetween(momentFrom, momentTo, null, '[)');
    }
    return value => moment(value).isSameOrAfter(momentFrom);
  }
  if (momentTo && momentTo.isValid()) {
    return value => moment(value).isBefore(momentTo);
  }
  return _.constant(true);
}

function processScalarFilter(filter) {
  if (_.isObject(filter)) {
    if (filter.type === 'range') {
      return processRangeFilter(filter);
    }
    if (filter.type === 'time-range') {
      return processTimeRangeFilter(filter);
    }
  }
  if (_.isArray(filter)) {
    return value => _.includes(filter, value);
  }
  return value => value === filter;
}

function processFilter(filter) {
  const scalarFilters = _.mapValues(filter, processScalarFilter);
  return item => _.every(
    scalarFilters,
    (scalarFilter, key) => scalarFilter(item[key]),
  );
}

function processBinGroupBy({ offset = 0, step }) {
  return value => (Math.floor((value - offset) / step) * step) + offset;
}

function processTimeBinGroupBy({ offset = 0, step }) {
  const offsetUnix = +moment(offset);
  const durationMs = moment.duration(step).as('milliseconds');

  return (value) => {
    const valueUnix = +moment(value);

    return processBinGroupBy({ offset: offsetUnix, step: durationMs })(valueUnix);
  };
}

function processTimePhaseGroupBy({ offset = 0, step }) {
  const offsetUnix = +moment(offset);
  const durationMs = moment.duration(step).as('milliseconds');

  return (value) => {
    const valueUnix = +moment(value);

    return Math.floor((valueUnix - offsetUnix) % durationMs) + offsetUnix;
  };
}

function processScalarGroupBy(groupBy) {
  if (groupBy === 'value') {
    return _.identity;
  }
  if (groupBy === 'day') {
    return value => moment(value).format('YYYY-MM-DD');
  }
  if (groupBy === 'week') {
    return value => moment(value).format('YYYY-[W]WW');
  }
  if (groupBy === 'month') {
    return value => moment(value).format('YYYY-MM');
  }
  if (groupBy === 'year') {
    return value => moment(value).format('YYYY');
  }
  if (_.isObject(groupBy) && groupBy.type === 'bin') {
    return processBinGroupBy(groupBy);
  }
  if (_.isObject(groupBy) && groupBy.type === 'time-bin') {
    return processTimeBinGroupBy(groupBy);
  }
  if (_.isObject(groupBy) && groupBy.type === 'time-phase') {
    return processTimePhaseGroupBy(groupBy);
  }
  return _.constant('*');
}

function processGroupBy(groupBy) {
  const dimensions = _.keys(groupBy);
  const scalarGroups = _.mapValues(groupBy, processScalarGroupBy);
  return {
    dimensions,
    callback: item => JSON.stringify(_.map(
      dimensions,
      key => scalarGroups[key](item[key]),
    )),
  };
}

function processOrderBy(orderBy) {
  const options = _.map(orderBy, option => ({
    key: _.replace(option, /^-\s*/, ''),
    direction: option.match(/^-\s*/) ? -1 : 1,
  }));
  return (a, b) => {
    let result = 0;
    _.forEach(options, ({ key, direction }) => {
      const propA = a[key];
      const propB = b[key];

      if (propA < propB) {
        result = -direction;
      } else if (propA > propB) {
        result = direction;
      }

      return !result;
    });
    return result;
  };
}
export function query2(dataOriginal, {
  aggregation = {},
  filter = {},
  groupBy = {},
  orderBy,
  offset = 0,
  top,
}) {
  const cbAggregate = processAggregation(aggregation);
  const cbFilter = processFilter(filter);
  const {
    dimensions: dimGroup,
    callback: cbGroup,
  } = processGroupBy(groupBy);

  const dataFiltered = _.filter(dataOriginal, cbFilter);
  const dataGrouped = _.groupBy(dataFiltered, cbGroup);
  const dataAggregated = _.mapValues(dataGrouped, cbAggregate);
  const dataFlattened = _.map(
    _.toPairs(dataAggregated),
    ([key, value]) => _.assignIn(_.zipObject(dimGroup, JSON.parse(key)), value),
  );

  if (orderBy) {
    dataFlattened.sort(processOrderBy(orderBy));
  }

  const result = dataFlattened.slice(
    offset,
    _.isUndefined(top) ? top : offset + top,
  );

  return result;
}

export function query(id, options) {
  const dataOriginal = storage.read(id);

  return storage.write(query2(dataOriginal, options));
}
