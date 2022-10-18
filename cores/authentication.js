const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const KaryawanModel = require("./model")

//Password Hashing Process
exports.makePassword = async (password, salt = null) => {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex')
  }
  password = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return { password, salt }
}

//Untuk Mengecek Kesamaan Info Login Admin
exports.authenticated = async (req) => {
  const user = await KaryawanModel.findOne({ username: req.body.username })
  if (!user) {
    return null
  }
  const { password } = await this.makePassword(req.body.password, user.salt)
  if (password === user.password) {
    return {
      username: user.username,
      nik: user.nik,
      departemen: user.departemen,
      isSPV: user.isSPV,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      name: user.name
    }
  }
  return null
}

//untuk Membuat Token Login
exports.makeToken = async (user) => {
  let hour = 4;
  let time = hour*3600;
  let token = jwt.sign(user, process.env.PROJECT_KEY, {expiresIn: `${time}s`})
  return token;
}