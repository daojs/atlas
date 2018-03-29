const fs = require('fs');
const _ = require('lodash');

function generateRevenue() {
  return _.random(10000 * 30, 1000000 * 30);
}

const branches = [
  '江西',
  '湖北',
  '重庆',
  '珠三角',
  '广西',
  '海南',
  '福建',
  '江苏',
];

const data = _.flatten(_.map(_.range(12), month => _.map(branches, branch => ({
  branch,
  month: `2015-${month + 1}`,
  gap: generateRevenue() - generateRevenue(),
}))));

fs.writeFile('./data/revenue-gap.json', JSON.stringify(data));
