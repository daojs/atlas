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
    .map((item) => {
      const [, month, day] = item.Timestamp.match(/(\D+)-(\d+)/);

      return {
        ape: item.APE,
        mape: item.MAPE,
        timestamp: item.Timestamp,
        target: parseFloat(item.Value),
        forecast: parseFloat(item['Predicted value'] || item['Predicted Value']),
        category: item.Category,
        branch: item.Province,
        month,
        day,
      };
    })
    .thru((value) => {
      if (groupBy.timestamp === 'month') {
        return _.chain(value)
          .groupBy(_.property('month'))
          .values()
          .map(monthValue => ({
            target: _.chain(monthValue).map('target').compact().sum().value(),
            forecast: _.chain(monthValue).map('forecast').compact().sum().value(),
            branch: filter.Branch,
            category: filter.Category,
          }))
          .value();
      }

      return value;
    })
    .value();

  return {
    data,
  };
};
