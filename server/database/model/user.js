const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const saltRounds = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000

const userSchema = new Schema({
  username: {
    unique: true,
    required: true,
    type: String
  },
  password: {
    unique: true,
    required: true,
    type: String
  },
  email: {
    unique: true,
    type: String
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: Number, // 锁定时间
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// 计算属性
userSchema.virtual('isLocked').get(() => {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.pre('save', next => {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

userSchema.pre('save', next => {
  if (!userSchema.isModified('password')) return next()
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error)
      this.password = hash
      next()
    })
  })
  next()
})

userSchema.methods = {
  comparePassword(_password, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  },
  incLoginAttempts(user) {
    if (this.lockUntil && this.lockUntil < Date.now()) {
      this.update({
        $set: {
          loginAttempts: 1
        },
        $unset: {
          lockUntil: 1
        }
      }, err => {
        if (!err) resolve(true)
        else reject(err)
      })
    } else {
      let updates = {
        $inc: {
          loginAttempts: 1
        }
      }
      if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = {
          lockUntil: Date.now() + LOCK_TIME
        }
      }
      this.update(updates, err => {
        if (!err) resolve(true)
        else reject(err)
      })
    }
  }
}

module.exports = mongoose.model('User', userSchema)
