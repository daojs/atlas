const _ = require('lodash');

const rawData = {};
rawData.RevenueByBranch = require('../../data/revenue_province.json');
rawData.RevenueByCategory = require('../../data/revenue_category.json');
rawData.VolumeByCategory = require('../../data/salescount_category.json');
rawData.VolumeByBranch = require('../../data/salescount_province.json');

const dictionary = {
  Branch: 'Province',
  target: 'Value',
  forecast: 'Predicted value',
};

module.exports = function getData(body) {
  const args = body['@args'];
  const [entity, { aggregation, filter, groupBy }] = args;
  const filterKey = _.first(_.keys(filter));
  const filterValue = filter[filterKey];

  const data = _.chain(rawData[`${entity}By${filterKey}`])
    .filter({
      [dictionary[filterKey] || filterKey]: filterValue,
    })
    .map(item => _.mapKeys(item, (value, key) => _.invert(dictionary)[key] || key))
    .thru((value) => {
      if (groupBy.timestamp === 'month') {
        return _.groupBy(value, v => v.timestamp);
      }

      return value;
    })
    .value();

  return {
    data,
  };
};
