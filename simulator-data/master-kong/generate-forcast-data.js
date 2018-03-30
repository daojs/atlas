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
      const forcastRevenue = generateRevenue();
      data.push({
        month,
        category,
        branch,
        targetRevenue,
        forcastRevenue,
        revenueGap: targetRevenue - forcastRevenue,
        targetVolume: generateVolume(),
        forcastVolume: generateVolume(),
      });
    });
  });
});

fs.writeFile('./data/forcast.json', JSON.stringify(data));
