const express = require("express")
const AdminController = express.Router()
const KaryawanModel = require("../../cores/model")
const { makePassword } = require("../../cores/authentication")
const { generateNIK, cekFormatJam } = require("../../cores/helper")
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
  let statusJamMasuk = "08:00:00", statusJamKeluar = "17:00:00"
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
    jamMasuk: req.body.jamMasuk,
    jamKeluar: req.body.jamKeluar,
    ...passwordSalt
  })
  if (req.body.jamMasuk) {
    statusJamMasuk = await cekFormatJam(req.body.jamMasuk)
  }
  if (req.body.jamKeluar) {
    statusJamKeluar = await cekFormatJam(req.body.jamKeluar)
  }
  if (statusJamMasuk && statusJamKeluar) {
    await newKaryawan.save()
    let data = await KaryawanModel.findOne({ nik: nik }, { password: 0, salt: 0 })
    return res.status(201).json({ data })
  }
  else {
    return res.status(400).json({ message: "Format Jam Tidak Sesuai <hh:mm:ss>" })
  }
})


//Untuk menampilkan daftar seluruh user
AdminController.get("/", async (req, res) => {
  let data = await KaryawanModel.find({}, { password: 0, salt: 0 })
  res.json({ data })
})

//untuk fitur cari data karyawan spesifik admin
AdminController.get("/search/:nik", async (req, res) => {
  let nik = handleNIK(req, res)
  let data = await KaryawanModel.findOne({ nik }, { password: 0, salt: 0 })
  return res.json({ data })
})

//untuk fitur update data karyawan untuk admin
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
  }))
  let data = await KaryawanModel.findOne({ nik }, { password: 0, salt: 0 })
  return res.status(200).json({ data })
})

//Untuk fitur hapus entry data karyawan buat admin
AdminController.delete("/search/:nik", async (req, res) => {
  let nik = handleNIK(req, res)
  let data = await KaryawanModel.findOneAndRemove({ nik }, { password: 0, salt: 0 })
  return res.json({ data })
})

module.exports = AdminController