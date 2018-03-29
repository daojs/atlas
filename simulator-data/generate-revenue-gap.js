const fs = require('fs');
const _ = require('lodash');
const branches = require('../src/master-kong/branch');
const categories = require('../src/master-kong/category');

function generateRevenue() {
  return _.random(10000 * 30, 1000000 * 30);
}

const data = _.flattenDeep(_.map(_.range(3), month => _.map(branches, branch => _.map(categories, category => ({
  category,
  branch,
  month: `2018-${month + 4}`,
  gap: generateRevenue() - generateRevenue(),
})))));

fs.writeFile('./data/revenue-gap.json', JSON.stringify(data));
