const fs = require("fs")


fs.readFile('../../package.json', () => {
  console.log('readfile')
  process.nextTick(() => {
    console.log('read nextTick')
  })
})

setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(() => {
    console.log('promise')
  })
  process.nextTick(() => {
    console.log('nextTick')
  })
}, 0)

setTimeout(() => {
  console.log('timer2')
}, 0)

setImmediate(() => {
  console.log('immediate')
})