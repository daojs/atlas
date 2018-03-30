import _ from 'lodash';

function sortByTimestamp(data, timestampKey) {
  return _.sortBy(data, ({ [timestampKey]: timestamp }) => new Date(timestamp));
}

export function cumulative(data, {
  measureKey,
  timestampKey,
}) {
  // starting from 0?
  const [first, ...rest] = sortByTimestamp(data, timestampKey);
  return _.reduce(rest, (memo, item, index) => {
    memo.push({
      timestamp: item[timestampKey],
      value: item[measureKey] + memo[index].value,
      raw: item,
    });

    return memo;
  }, [{
    timestamp: first[timestampKey],
    value: first[measureKey],
    raw: first,
  }]);
}

export function cumulativeKeys(data, {
  measureKeys,
  timestampKey,
}) {
  const [first, ...rest] = sortByTimestamp(data, timestampKey);
  return _.reduce(rest, (memo, item, index) => {
    memo.push(_.reduce(measureKeys, (result, key) => {
      result[key] = item[key] + memo[index][key]; //eslint-disable-line

      return result;
    }, {
      [timestampKey]: item[timestampKey],
      raw: item,
    }));

    return memo;
  }, [{
    [timestampKey]: first[timestampKey],
    raw: first,
    ...first,
  }]);
}

export function growthRate(data, {
  measureKey,
  timestampKey,
}) {
  const [first, ...rest] = sortByTimestamp(data, timestampKey);
  return _.reduce(rest, (memo, item, index) => {
    const lastItemValue = memo[index].raw[measureKey];

    memo.push({
      timestamp: item[timestampKey],
      value: lastItemValue ? ((item[measureKey] - lastItemValue) / lastItemValue) : undefined,
      raw: item,
    });

    return memo;
  }, [{
    timestamp: first[timestampKey],
    value: 0,
    raw: first,
  }]);
}
