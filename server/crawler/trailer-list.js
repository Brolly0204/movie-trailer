const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/tag/#/?sort=U&range=6,10&tags='

const sleep = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

// 接收主进程发来的消息
process.on('message', m => {
  console.log('子进程收到消息', m)
})

;(async () => {

  const browser = await puppeteer.launch({
    // https://www.cnblogs.com/lovesong/p/5087423.html
    // https://zhidao.baidu.com/question/539980267.html
    args: ['--no-sandbox'] // 关掉浏览器沙盒模式（用于为一些来源不可信、具备破坏力或无法判定程序意图的程序提供试验环境。然而，沙盒中的所有改动对操作系统不会造成任何损失）
  })
  const page = await browser.newPage()
  await page.goto(url, {
    // waitUntil: 'networkidle2'
  })

  await page.waitForSelector('.more')

  for (let i = 0; i < 3; i++) {
    await sleep(3000)
    await page.click('.more')
  }

  const result = await page.evaluate(() => {
    let $ = window.$
    let items = $('.list-wp > a')
    const links = []
    if (items.length > 0) {
      items.each((index, item) => {
        let $it = $(item)
        let doubanId = $it.find('.cover-wp').data('id')
        let title = $it.find('.title').text()
        let rate = $it.find('.rate').text()
        // https://img1.doubanio.com/view/photo/s_ratio_poster/public/p510876377.jpg
        let poster = $it.find('.pic > img').prop('src').replace('s_ratio', 'l_ratio')
        links.push({
          doubanId,
          title,
          rate,
          poster
        })
      })
    }
    return links
  })

  browser.close()

  process.send({result}, function() {
    process.exit(0)
  })
})()