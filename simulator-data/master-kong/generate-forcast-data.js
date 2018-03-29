const fs = require('fs');
const _ = require('lodash');

function generateRevenue() {
  return _.random(10000 * 30, 1000000 * 30);
}
function generateVolume() {
  return _.random(100, 500);
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
const categories = [
  '冰茶',
  '劲凉冰茶',
  '绿茶',
  '乌龙茗茶',
  '茉莉茶',
  '康师傅果汁',
  '传世清饮',
  '每日C果汁',
  '康师傅包装水',
  '水漾',
  '经典奶茶',
  '冰糖系列',
  '本味茶庄',
  '饮养奶咖',
  '轻养果荟',
  '乳酸菌',
  '一刻馆',
  '其他',
  '铁观音',
];
const months = [
  '2015-4',
  '2015-5',
  '2015-6',
];

const data = [];

_.forEach(branches, (branch) => {
  _.forEach(categories, (category) => {
    _.forEach(months, (month) => {
      data.push({
        month,
        category,
        branch,
        targetRevenue: generateRevenue(),
        forcastRevenue: generateRevenue(),
        targetVolume: generateVolume(),
        forcastVolume: generateVolume(),
      });
    });
  });
});

fs.writeFile('./data/forcast.json', JSON.stringify(data));
