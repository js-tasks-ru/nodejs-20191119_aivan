const path = require('path');
const Koa = require('koa');
const app = new Koa();

const pubSub = require('./pubSub');

const NEW_MESSAGE_EVENT = 'NEW_MESSAGE_EVENT';

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

async function handleSubscription(ctx) {
  const id = ctx.request.query.r;

  return new Promise((resolve) => {
    pubSub.subscribe(NEW_MESSAGE_EVENT, id, (message) => {
      ctx.body = message;
      resolve();
    });
  });
}


router.get('/subscribe', async (ctx, next) => {
  await handleSubscription(ctx);
  next();
});


router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;

  if (!message) {
    return;
  }

  pubSub.publish(NEW_MESSAGE_EVENT, message);

  ctx.response.status = 200;
  next();
});

app.use(router.routes());

module.exports = app;
