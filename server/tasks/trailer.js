const cp = require('child_process')
const { resolve } = require('path')

;(() => {
  const child = cp.fork(resolve(__dirname, '../crawler/trailer-video.js'))

  child.on('message', m => {
    console.log('video', m)
  })

  let invoked = false
  child.on('error', err => {
    if (invoked) return
    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return
    console.log(code)
    process.exit(code)
  })
})()
