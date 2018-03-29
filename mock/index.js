const _ = require('lodash');

function getFakeValue(cur) {
  return `fake ${cur}`;
}

module.exports = function mock(body) {
  if (body['@proc'] !== 'query') {
    throw new Error('only "query" is supported for field "@proc" ');
  }

  const arg = _.last(body['@args']);
  const { aggregation, filter, groupBy } = arg;

  return {
    data: _.map(_.range(100), () => _.reduce(_.keys({ ...aggregation, ...filter, ...groupBy }), (memo, cur) => ({
      [cur]: getFakeValue(cur),
      ...memo,
    }), {})),
  };
};
