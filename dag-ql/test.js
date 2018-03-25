const _ = require('lodash');
const Promise = require('bluebird');
const yaml = require('yamljs');
const Compiler = require('./index');
const path = require('path');

const ql = yaml.load(path.join(__dirname, 'test.yaml'));

const compiler = new Compiler({
  sum: values => Promise.delay(1000).then(() => _.sum(values)),
});

const cn = compiler.compile(ql, {
  onInvalidated: key => console.log('Invalidated', key),
  onCalculated: (key, value) => console.log('Calculated', key, value),
});

cn
  .get('result')
  .then(console.log)
  .then(() => cn.set('foo', 11))
  .then(() => cn.get('result'))
  .then(console.log);

