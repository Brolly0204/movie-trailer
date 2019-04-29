
process.on('message', m => {
  console.log('儿子收到的消息: ', m)
  process.send( { mess: 'son回复: 好的老爸！' })
  process.exit(0)
})