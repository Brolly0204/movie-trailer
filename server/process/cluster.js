const cluster = require('cluster')
const cpus = require('os').cpus()

let workers = []
const masterProcess = () => {
  console.log(`共有 ${cpus.length}个核`)
  console.log(`Master 主进程 ${process.pid} 正在运行`)
  for (let i = 0; i < cpus.length; i++) {
    console.log(`正则fork子进程${i}`)
    const worker = cluster.fork()
    workers.push(worker)
    worker.on('message', mess => {
      console.log(`M主进程 ${process.pid} 收到 ${JSON.stringify(mess)} 来自 ${worker.process.pid}的消息`)
    })
  }
  workers.forEach(worker => {
    console.log(`主进程${process.pid} 开始发消息给 子进程${worker.process.pid}`)
    worker.send({ msg: `来自主进程的消息 ${process.pid}` })
  })
}

const childProcess = () => {
  console.log(`子进程 ${process.pid} 启动`)
  process.on('message', msg => {
    console.log(`S子进程 ${process.pid} 收到 主进程的消息 ${JSON.stringify(msg)}`)
  })

  console.log(`子进程 ${process.pid} 开始发送消息 给 主进程`)

  process.send({ msg: `来自子进程的消息 ${process.pid}` })
}

if (cluster.isMaster) {
  masterProcess()
} else {
  childProcess()
}


