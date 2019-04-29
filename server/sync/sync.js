const doSync = (task, time) => new Promise(resolve => {
  setTimeout(() => {
    console.log(`${task}, 用了${time}毫秒`)
    resolve()
  }, time)
})

const doAsync = (task, time, cb) => {
  setTimeout(() => {
    console.log(`${task}, 用了${time}毫秒`)
    cb && cb()
  }, time)
}

const doElse = task => {
  console.log(task)
}

const Brolly = { doSync, doAsync, doElse }
const Meizi = { doSync, doAsync, doElse }

;(async () => {
  // console.log('case 1: 妹子在门口等')
  // await Brolly.doSync('Brolly 刷牙', 1000)
  // console.log('妹子啥也没干, 一直等')
  // await Meizi.doSync('妹子洗澡', 2000)
  // console.log('妹子去忙别的')

  console.log('case 3: 妹子来到门口 按下通知开关')
  Brolly.doAsync('Brolly 刷牙', 1000, () => {
    console.log('通知妹子来洗澡')
    Meizi.doAsync('妹子洗澡', 2000)
  })
  Meizi.doElse('妹子去忙别的了')
})()

