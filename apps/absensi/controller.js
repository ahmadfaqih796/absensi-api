const express = require("express")
const AbsensiController = express.Router()
const AbsensiModel = require("./model")
const KaryawanModel = require("../karyawan/models")
const { generateKodeDetail } = require("../../cores/helper")
const { generateJam, generateTanggal } = require("../../cores/dates")

//untuk absen jam masuk
AbsensiController.post("./absensi", async (req, res) => {
  const dataKaryawan = await KaryawanModel.findOne({ username: req.body.username })
  let kodeabsen = await generateKodeDetail(dataKaryawan.nik, "ABSN", req.body.tanggal)
  let jammasuk = await generateJam()
  let tanggal = await generateTanggal()
  const newAbsensi = new AbsensiModel({
    kodeabsen: kodeabsen,
    nik: dataKaryawan.nik,
    tanggal: tanggal,
    jammasuk: jammasuk,
  })
  if (jammasuk > "08:00") {
    res.status.json("Anda terlambat")
  }
})