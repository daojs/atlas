var fs = require('fs');
var md5 = require('md5');

function _path(key) {
  const dir = __dirname + '/cache/';

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  return dir + md5(JSON.stringify(key));
}

function WriteToCache(key, data) {
  if (data === undefined || data === null) return;

  var path = _path(key);

  console.log('WriteToCache'.concat(path));

  return fs.writeFileSync(path, JSON.stringify(data));
}

function ReadFromCache(key) {
  var path = _path(key);

  console.log('ReadFromCache:'.concat(path));

  return JSON.parse(fs.readFileSync(path));
}

function IsInCache(key) {
  var path = _path(key);

  console.log(path);

  return fs.existsSync(path);
}

module.exports = {
  writeToCache : WriteToCache,
  readFromCache : ReadFromCache,
  isInCache : IsInCache,
};
