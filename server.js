const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');
const koaBody = require('koa-body');
const rp = require('request-promise');

const cacheManager = require('./cache-manager.js');
const masterKong = require('./api/master-kong');

const app = new Koa();
const router = new Router();


router.post('/insight', koaBody(), async (ctx, next) => {
  const { body } = ctx.request;

  if (body['@target'] === 'master-kong') {
    ctx.body = await masterKong(body);
  } else if (cacheManager.isInCache(body)) {
    ctx.body = cacheManager.readFromCache(body);
  } else {
    const result = await rp.post({
      uri: 'http://13.92.89.95:8080/insight',
      json: true,
      body,
    });

    cacheManager.writeToCache(body, result);

    ctx.body = result;
  }

  await next();
});

app.use(router.routes()).use(router.allowedMethods());

app.use(serve('./'));

module.exports = app.listen(9000);
