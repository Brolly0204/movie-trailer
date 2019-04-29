const axios = require('axios')

// http://api.douban.com/v2/movie/subject/1350410
const url = 'http://api.douban.com/v2/movie/subject/'

const fetchMovie = async movie => {
  const result = await axios.get(url + movie.doubanId)
  return result
}

;(() => {
  let movieData = [
    {
      doubanId: 3025375,
      title: '奇异博士',
      rate: '7.6',
      poster:
        'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2388501883.jpg'
    },
    {
      doubanId: 25964071,
      title: '夏洛特烦恼',
      rate: '7.5',
      poster:
        'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2264377763.jpg'
    }
  ]
  movieData.map(async movie => {
    const movieData = await fetchMovie(movie)
    const { genres, summary } = movieData.data
    console.log(genres, summary)
  })
})()
