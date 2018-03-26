import _ from 'lodash';

function sortByTimestamp(data) {
  return _.sortBy(data, ({ timestamp }) => new Date(timestamp));
}

export function cumulative(data, measure) {
  // starting from 0?
  const [first, ...rest] = sortByTimestamp(data);
  return _.reduce(rest, (memo, item, index) => [...memo, {
    timestamp: item.timestamp,
    value: item[measure] + memo[index].value,
    raw: item,
  }], [{
    timestamp: first.timestamp,
    value: first[measure],
    raw: first,
  }]);
}

export function growthRate(data, measure) {
  const [first, ...rest] = sortByTimestamp(data);
  return _.reduce(rest, (memo, item, index) => {
    const lastItemValue = memo[index].raw[measure];

    return [...memo, {
      timestamp: item.timestamp,
      value: (item[measure] - lastItemValue) / lastItemValue,
      raw: item,
    }];
  }, [{
    timestamp: first.timestamp,
    value: 0,
    raw: first,
  }]);
}
