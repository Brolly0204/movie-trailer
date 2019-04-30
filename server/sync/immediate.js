setImmediate(() => {
  console.log('immediate1')
  process.nextTick(() => {
    console.log('n1')
    process.nextTick(() => {
      console.log('n2')
    })
  })
}, 0)

setImmediate(() => {
  console.log('immediate2')
  process.nextTick(() => {
    console.log('n3')
    process.nextTick(() => {
      console.log('n4')
    })
  })
}, 0)