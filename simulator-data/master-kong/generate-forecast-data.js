const fs = require('fs');
const _ = require('lodash');
const branches = require('../../src/master-kong/branch');
const categories = require('../../src/master-kong/category');

function generateRevenue() {
  return _.random(10 * 30, 100000 * 30);
}
function generateVolume() {
  return _.random(100, 500);
}

const months = [
  '2018-4',
  '2018-5',
  '2018-6',
];

const data = [];

_.forEach(branches, (branch) => {
  _.forEach(categories, (category) => {
    _.forEach(months, (month) => {
      const targetRevenue = generateRevenue();
      const forecastRevenue = generateRevenue();
      data.push({
        month,
        category,
        branch,
        目标销售额: targetRevenue,
        预测销售额: forecastRevenue,
        销售指标差距: targetRevenue - forecastRevenue,
        目标销量: generateVolume(),
        预测销量: generateVolume(),
      });
    });
  });
});

fs.writeFile('./data/forecast.json', JSON.stringify(data));
