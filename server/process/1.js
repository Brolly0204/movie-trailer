const cp = require('child_process')
const { resolve } = require('path')

const child = cp.fork(resolve(__dirname, './2.js'))

child.send({ mess: '儿子去给老爸买盒烟' })

child.on('message', m => {
  console.log('老爸收到的回复', m)
})
