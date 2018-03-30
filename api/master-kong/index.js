const _ = require('lodash');

const rawData = {};
rawData.RevenueByBranch = require('../../data/revenue_province.json');
rawData.RevenueByCategory = require('../../data/revenue_category.json');
rawData.VolumeByCategory = require('../../data/salescount_category.json');
rawData.VolumeByBranch = require('../../data/salescount_province.json');
rawData.VolumeByAll = require('../../data/salescount_all.json');
rawData.RevenueByAll = require('../../data/revenue_all.json');

const dictionary = {
  Branch: 'Province',
  target: 'Value',
  forecast: 'Predicted value',
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function toFloat(string) {
  const floatValue = parseFloat(string);

  return Math.round(floatValue * 100) / 100;
}

module.exports = function getData(body) {
  const args = body['@args'];
  const [entity, { aggregation, filter, groupBy }] = args;
  const fileKey = capitalizeFirstLetter(_.chain(groupBy).keys().intersection(['branch', 'category']).first().value() || 'all');
  const initData = rawData[`${entity}By${fileKey}`];

  const data = _.chain(initData)
    .map((item) => {
      const [, month, year] = item.Timestamp.match(/(\D+)-(\d+)/);

      return {
        ape: item.APE,
        mape: item.MAPE,
        target: toFloat(item.Value || item.value),
        forecast: toFloat(item['Predicted value'] || item['Predicted Value']),
        category: item.Category,
        branch: item.Province,
        month,
        year,
        timestamp: new Date(`20${year}-${month}`).toISOString(),
      };
    })
    .filter(filter)
    // .thru((value) => {
    //   if (groupBy.timestamp === 'month') {
    //     return _.chain(value)
    //       .groupBy(_.property('month'))
    //       .values()
    //       .map(monthValue => ({
    //         target: _.chain(monthValue).map('target').compact().sum().value(),
    //         forecast: _.chain(monthValue).map('forecast').compact().sum().value(),
    //         branch: filter.branch,
    //         category: filter.category,
    //       }))
    //       .value();
    //   }

    //   return value;
    // })
    .value();

  return {
    data,
  };
};
