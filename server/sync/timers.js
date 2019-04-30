setTimeout(() => {
  console.log('timer1')
  process.nextTick(() => {
    console.log('nextTick')
  })
}, 0)

setTimeout(() => {
  console.log('timer2')

}, 0)