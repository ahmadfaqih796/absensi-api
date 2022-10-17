const express = require("express")
const AdminController = express.Router()
const AdminModel = require("./model")
const { makePassword, makeToken, authenticated } = require("./authentication")

//untuk Registrasi
AdminController.post("/register", async (req, res) => {
  const passwordSalt = await makePassword(req.body.password)
  const newAdmin = new AdminModel({
    username: req.body.username,
    name: req.body.name,
    ...passwordSalt
  })
  await newAdmin.save()
  return res.status(201).json({
    username: req.body.username,
    name: req.body.name
  })
})

//Untuk menampilkan daftar admin
//TODO: masih nampilin data password dan salt
AdminController.get("/", async (req, res) => {
  let data = await AdminModel.find()
  res.json(data)
})

//Untuk Login
AdminController.post("/login", async (req, res) => {
  const user = await authenticated(req)
  if (user) {
    res.json({ token: await makeToken(user) })
  } else {
    res.status(401).json({ Message: "Invalid Login Data, Please Try Again" })
  }
})

module.exports = AdminController