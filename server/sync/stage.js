const { readFile } = require('fs')
const EventEmitter = require('events')

class Ee extends EventEmitter {}

const yy = new Ee()
yy.on('event', () => {
  console.log('好消息！')
})

setTimeout(() => { // 7
  console.log('0毫秒')
}, 0)

setTimeout(() => { // 11
  console.log('10毫秒')
}, 10)

setTimeout(() => { // 12
  console.log('20毫秒')
}, 20)


readFile('../../package.json', 'utf-8', data => { // 8
  console.log('完成文件1 读操作的回调')
})


readFile('../../README.md', 'utf-8', data => { // 9
  console.log('完成文件2 读操作的回调')
})

setImmediate(() => { // 10
  console.log('immediate 立即回调')
})

// 1
process.nextTick(() => {
  console.log('process.nextTick1 的回调')
})

Promise.resolve()
.then(() => { // 2
  yy.emit('event') // 3
  process.nextTick(() => { // 6
    console.log('process.nextTick2 的回调')
  })
})
.then(() => { // 4
  console.log('Promise的第一次回调')
}).then(() => { // 5
  console.log('Promise的第二次回调')
})