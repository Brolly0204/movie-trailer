const Koa = require('koa')
const ejs = require('ejs')
const pug = require('pug')
const views = require('koa-views')
const { resolve } = require('path')

const app = new Koa()

app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))

const { htmlTpl, ejsTpl, pugTpl } = require('./tpl')

app.use(async (ctx, next) => {
  await ctx.render('index', {
    you: 'wenli',
    me: 'Brolly'
  })
})

app.listen(2266)


// app.use(async (ctx, next) => {
//   ctx.type = 'text/html; charset=utf-8'
//   ctx.body = pug.render(pugTpl, {
//     you: 'Vater pug',
//     me: 'Brolly pug'
//   })
//   // ctx.body = ejs.render(ejsTpl, {
//   //   you: 'Vater ejs',
//   //   me: 'Brolly ejs'
//   // })
// })