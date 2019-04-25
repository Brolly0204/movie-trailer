const Koa = require('koa')
const ejs = require('ejs')
const pug = require('pug')

const app = new Koa()

const { htmlTpl, ejsTpl, pugTpl } = require('./tpl')

app.use(async (ctx, next) => {
  ctx.type = 'text/html; charset=utf-8'
  ctx.body = pug.render(pugTpl, {
    you: 'Vater pug',
    me: 'Brolly pug'
  })
  // ctx.body = ejs.render(ejsTpl, {
  //   you: 'Vater ejs',
  //   me: 'Brolly ejs'
  // })
})

app.listen(2266)