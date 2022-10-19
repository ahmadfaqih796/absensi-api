const express = require("express")
const AbsensiController = express.Router()
const UserModel = require("../../cores/model")
const AbsensiModel = require("./model")
const { generateKode } = require("../../cores/helper")
const { generateJam, generateTanggal } = require("../../cores/dates")

//untuk absen jam masuk
AbsensiController.post("", async (req, res) => {
  const dataKaryawan = await UserModel.findOne({ nik: req.body.nik })
  // kalau tidak ada data karyawan yang sesuai, kembalikan error
  if (!dataKaryawan) {
    res.status(400).json({ message: "Data Karyawan Tidak Tersedia" })
  } else { //kalau ada data karyawan, periksa data absen
    let tanggal = await generateTanggal()
    let jam = await generateJam()
    let kodeAbsen = await generateKode(dataKaryawan.nik, "-ABSEN-", tanggal)
    const dataAbsen = await AbsensiModel.findOne({ kodeAbsen: kodeAbsen })
    const newAbsen = new AbsensiModel({
      kodeAbsen: kodeAbsen,
      nik: dataKaryawan.nik,
      date: tanggal,
      jamMasuk: jam
    })
    //kalau belum ada data absen, buat data absen untuk hari ini dan langsung catat jam
    if (!dataAbsen) {
      await newAbsen.save()
      if (jam > "08:00:00") {
        res.json({ message: "Anda terlambat" })
      } //kalau datang terlambat
      let data = await AbsensiModel.findOne({ kodeAbsen })
      return res.json(data)
    }
    //kalau sudah ada data absen, cek apakah ada data jam pulang atau belum
    else if (!dataAbsen.jamPulang) {
      await AbsensiModel.findOneAndUpdate({ kodeAbsen }, ({
        jamPulang: jam
      }))
      let data = await AbsensiModel.findOne({ kodeAbsen })
      return res.json(data)
    } //else if belum ada jam pulang
    else {
      let data = await AbsensiModel.findOne({ kodeAbsen })
      res.json({ message: "Anda sudah absen untuk hari ini", data })
    }
    return null
  }
})

module.exports = AbsensiController