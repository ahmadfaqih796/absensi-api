const express = require("express")
const AdminController = express.Router()
const KaryawanModel = require("../../cores/model")
const { makePassword } = require("../../cores/authentication")
const { generateNIK } = require("../../cores/helper")
const { exists } = require("../../cores/model")

//untuk Registrasi semua User (Staff, SPV, Admin)
AdminController.post("/register", async (req, res) => {
  const passwordSalt = await makePassword(req.body.password)
  const date = new Date()
  let tahun = String(date.getFullYear())
  let bulan = String(date.getMonth()+1).padStart(2, "0")
  console.log("bulan",bulan)
  let tahunbulan = tahun+bulan
  let nik = await generateNIK(tahunbulan, KaryawanModel)
  const newKaryawan = new KaryawanModel({
    username: req.body.username,
    name: req.body.name,
    gender: req.body.gender,
    departemen: req.body.departemen,
    isSPV: req.body.isSPV,
    isAdmin: req.body.isAdmin,
    phone: req.body.phone,
    alamat: req.body.alamat,
    tanggalMasuk: date,
    tahunBulanMasuk: tahunbulan,
    nik: nik,
    ...passwordSalt
  })
  console.log(newKaryawan)
  await newKaryawan.save()
  return res.status(201).json({
    username: req.body.username,
    name: req.body.name
  })
})

//Untuk menampilkan daftar seluruh user
AdminController.get("/", async (req, res) => {
  let data = await KaryawanModel.find({}, { username: 1, name: 1 })
  res.json({ data })
})


module.exports = AdminController