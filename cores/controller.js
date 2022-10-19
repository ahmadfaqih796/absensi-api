const express = require("express")
const UserController = express.Router()
const { makeToken, authenticated } = require("./authentication")
const { exists } = require("./model")

//Untuk Login
UserController.post("", async (req, res) => {
  const user = await authenticated(req)
  if (user) {
    res.json({
      token: await makeToken(user),
      username: user.username,
      nik: user.nik,
      departemen: user.departemen,
      isSPV: user.isSPV,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      name: user.name
    })
  } else {
    res.status(401).json({ Message: "Data Login Tidak Sesuai, Mohon Coba Lagi" })
  }
})

module.exports = UserController