const mongoose = require('mongoose')

const dbURL = 'mongodb://localhost/movie-trailer'
mongoose.Promise = global.Promise

const db = mongoose.connection

exports.connect = () => {
  let maxConnectTimes = 0
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true)
  }
  
  mongoose.connect(dbURL, { useNewUrlParser: true })

  db.on('disconnected', () => {
    maxConnectTimes++
    if (maxConnectTimes < 5) {
      mongoose.connect(dbURL, { useNewUrlParser: true })
    } else {
      throw new Error('数据库挂了')
    }
  })
  
  db.on('error', err => {
    maxConnectTimes++
    if (maxConnectTimes < 5) {
      mongoose.connect(dbURL, { useNewUrlParser: true })
    } else {
      throw new Error(err)
    }
  })

  db.once('open', () => {
    console.log('MongoDB Connect => successfully')

    const BrollySchema = new mongoose.Schema({ name: String })
    const Brolly = mongoose.model('Brolly', BrollySchema)

    let silence = new Brolly({ name: 'brolly' })
    
    console.log(silence.name)
    silence.save().then(() => console.log('save'))
  })
}