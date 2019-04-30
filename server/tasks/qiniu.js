let movies = [
  {
    doubanId: 1295644,
    link: 'https://movie.douban.com/trailer/108757/#content',
    cover: 'https://img1.doubanio.com/img/trailer/medium/1433855508.jpg',
    video:
      'http://vt1.doubanio.com/201904292339/2909ca3ea921dbc73ac5d7bd9ea63861/view/movie/M/301080757.mp4',
    poster:
      'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p511118051.jpg'
  }
]

const qiniu = require('qiniu')
const nanoid = require('nanoid')
const { basename } = require('path')

const baseURL = 'http://pqr5g73j6.bkt.clouddn.com/'

const { qiniu: { bucket, AK, SK } } = require('../config')

// 定义鉴权对象mac
const mac = new qiniu.auth.digest.Mac(AK, SK)

// 生成上传凭证
const options = {
  scope: bucket,
  callbackBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
  callbackBodyType: 'application/json' 
}

const putPolicy = new qiniu.rs.PutPolicy(options)

// 构建一个上传用的config对象
const config = new qiniu.conf.Config()
const bucketManager = new qiniu.rs.BucketManager(mac, config)
config.zone = qiniu.zone.Zone_z1
config.useCdnDomain = true


const uploadFile = (url, bucket, key) => {

  return new Promise((resolve, reject) => {
    // 上传在线资源
    bucketManager.fetch(url, bucket, `${nanoid()}_${key}`, (respErr, respBody, respInfo) => {
      if (respErr) {
        throw respErr
      }

      if (respInfo.statusCode === 200) {
        resolve(respBody)
      } else {
        console.log(respBody.statusCode, respBody)
        reject(respBody)
      }

    })
  })
}

movies.forEach(async movie => {
  const { cover, video, poster } = movie
  // const coverData = await uploadFile(cover, bucket, basename(cover))
  // const videoData = await uploadFile(video, bucket, basename(video))
  // const posterData = await uploadFile(poster, bucket, basename(poster))

  const results =  await Promise.all([
    uploadFile(cover, bucket, basename(cover)),
    uploadFile(video, bucket, basename(video)),
    uploadFile(poster, bucket, basename(poster))
  ])

  const [ coverData, videoData, posterData ] = results
  
  if (coverData && coverData.key) {
    movie.coverCDN = baseURL + coverData.key
  }

  if (videoData && videoData.key) {
    movie.videoCDN = baseURL + videoData.key
  }

  if (posterData && posterData.key) {
    movie.posterCDN = baseURL + posterData.key
  }

  console.log(movie)
})

// 七牛云域名: http://pqr5g73j6.bkt.clouddn.com/
// http://pqr5g73j6.bkt.clouddn.com/Qu3jQVcyLBh4Qk6rmJbS9301080757.mp4

// 参考文档
// Node.js SDK
// https://developer.qiniu.com/kodo/sdk/1289/nodejs
// 抓取网络资源到空间 
// https://developer.qiniu.com/kodo/sdk/1289/nodejs#rs-fetch