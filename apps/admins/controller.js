const express = require("express")
const AdminController = express.Router()
const KaryawanModel = require("../../cores/model")
const { makePassword } = require("../../cores/authentication")
const { generateNIK } = require("../../cores/helper")
const { exists } = require("../../cores/model")

const handleNIK = (req, res) => {
  let nik = req.params.nik;
  if (!nik) {
    res.status(400).json({ message: "Tidak ada Data yang Tersedia" })
  } else {
    return nik;
  }
}

//untuk Registrasi semua User (Staff, SPV, Admin)
AdminController.post("/register", async (req, res) => {
  const passwordSalt = await makePassword(req.body.password)
  const date = new Date()
  let tahun = String(date.getFullYear())
  let bulan = String(date.getMonth() + 1).padStart(2, "0")
  let tahunbulan = tahun + bulan
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
    isActive: req.body.isActive,
    ...passwordSalt
  })
  console.log(newKaryawan)
  await newKaryawan.save()
  // let { password, salt, ...data } = newKaryawan
  return res.status(201).json({
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
    isActive: req.body.isActive,
  })
})

//Untuk menampilkan daftar seluruh user
AdminController.get("/", async (req, res) => {
  let data = await KaryawanModel.find({}, { password: 0, salt: 0 })
  res.json({ data })
})

AdminController.get("/search/:nik", async (req, res) => {
  let nik = handleNIK(req, res)
  let data = await KaryawanModel.findOne({ nik })
  return res.json({ data })
})

AdminController.put("/search/:nik", async (req, res) => {
  let nik = handleNIK(req, res)
  const passwordSalt = await makePassword(req.body.password)
  await KaryawanModel.findOneAndUpdate({ nik }, ({
    username: req.body.username,
    name: req.body.name,
    gender: req.body.gender,
    departemen: req.body.departemen,
    isSPV: req.body.isSPV,
    isAdmin: req.body.isAdmin,
    phone: req.body.phone,
    alamat: req.body.alamat,
    nik: nik,
    isActive: req.body.isActive,
    ...passwordSalt
  }),)
  let data = await KaryawanModel.findOne({ nik })
  return res.status(200).json({ data })
})

AdminController.delete("/search/:nik", async (req, res) => {
  let nik = handleNIK(req, res)
  let data = await KaryawanModel.findOneAndRemove({ nik })
  return res.json({ data })
})
module.exports = AdminController