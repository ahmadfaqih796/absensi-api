const express = require("express")
const UserController = express.Router()
// const KaryawanModel = require("./model")
const { makeToken, authenticated } = require("./authentication")
const { exists } = require("./model")

//Untuk Login
UserController.post("", async (req, res) => {
  const user = await authenticated(req)
  if (user) {
    res.json({ token: await makeToken(user) })
  } else {
    res.status(401).json({ Message: "Data Login Tidak Sesuai, Mohon Coba Lagi" })
  }
})

module.exports = UserController