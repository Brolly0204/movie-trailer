const cp = require('child_process')
const { resolve } = require('path')

;(async () => {
  const script = resolve(__dirname, '../crawler/trailer-list.js')
  const child = cp.fork(script)

  // 给子进程发生消息
  child.send({ mess: 'hello world!' })

  child.on('message', data => {
    let result = data.result
    console.log('主进程 message', data)
  })

  invoked = false
  child.on('error', err => {
    if (invoked) return
    invoked = true
    console.log('err', err)
  })

  child.on('exit', code => {
    if (invoked) return
    invoked = false
    let err = code === 0 ? null : new Error('exit code ' + code)
    console.log('exit', err)
  })

})()