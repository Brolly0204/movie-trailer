const puppeteer = require('puppeteer')

const baseURL = 'https://movie.douban.com/subject/'
const doubanId = 25986662
const videoBase = 'https://movie.douban.com/trailer/219491'

const sleep = time => new Promise((resolve, reject) => {
  setTimeout(resolve, time)
})

;(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-cache']
  })
  
  const page = await browser.newPage()

  await page.goto(baseURL + doubanId, {
    waitUntil: 'networkidle2'
  })


  await sleep(1000)
  
  const result = await page.evaluate((x) => {
    const $ = window.$
    const $it = $('.related-pic-video')
    const cover = $it.css('background-image').match(/url\("(.*?)"\)/)[1]
    const link = $it.prop('href')
    return {
      link,
      cover
    }
  })

  let video
  if (result.link) {
    await page.goto(result.link, {
      waitUntil: 'networkidle2'
    })
    // await sleep(2000)
    
    video = await page.evaluate(() => {
      const $ = window.$
      const $source = $('#player-html5-241313_html5_api').find('source')
      return $source && $source.prop('src')
    })
    result.video = video
  }

  
  await browser.close()

  process.send({
    doubanId,
    ...result
  })
  process.exit(0)
})()
