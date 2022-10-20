const express = require("express")
const LaporanController = express.Router()
const UserModel = require("../../cores/model")
const LaporanModel = require("./model")
const { generateKode, getUser, generateTanggal, cekFormatJam } = require("../../cores/helper")

const handleNIK = (req, res) => {
  let nik = req.params.nik;
  if (!nik) {
    res.status(400).json({ message: "Tidak ada Data yang Tersedia" })
  } else {
    return nik;
  }
}

//untuk membuat laporan. Data User didapat dari token
LaporanController.post("/post", async (req, res) => {
  let user = await getUser(req);
  //harusnya sih selalu ada data user, tapi kalau misalkan gak ada, maka:
  if (!user.nik) {
    return res.status(404).json({ message: "Data Karyawan Tidak Ditemukan" })
  }
  else {
    let tanggal = await generateTanggal()
    let counter = await LaporanModel.find({ nik: user.nik, tanggal: tanggal }).count() + 1
    let kodeLaporan = await generateKode(user.nik, "LAPOR", tanggal, counter)
    const newLaporan = new LaporanModel({
      kodeLaporan: kodeLaporan,
      nik: user.nik,
      departemen: user.departemen,
      tanggal: tanggal,
      tugas: req.body.tugas,
      klien: req.body.klien,
      jamMulai: req.body.jamMulai,
      jamAkhir: req.body.jamAkhir,
      keterangan: req.body.keterangan
    })
    let statusJamMulai = await cekFormatJam(req.body.jamMulai)
    let statusJamAkhir = await cekFormatJam(req.body.jamAkhir)
    if (statusJamMulai && statusJamAkhir) {
      await newLaporan.save()
    }
    else {
      return res.status(400).json({ message: "Format Jam Tidak Sesuai <hh:mm:ss>" })
    }
  }
  return res.json({ message: "berhasil" })
})

//untuk melihat data laporan, data user didapat dari token
LaporanController.get("/get", async (req, res) => {
  let user = await getUser(req)
  let tanggal = req.body.tanggal
  let data = await LaporanModel.find({ tanggal: tanggal, departemen: user.departemen })
  return res.json({ data })
})

//untuk melihat data laporan khusus dari satu user
LaporanController.get("/get/:nik", async (req, res) => {
  let nik = handleNIK(req, res)
  let tanggal = req.body.tanggal
  let data = await LaporanModel.find({ tanggal: tanggal, nik: nik })
  return res.json({ data })
})

module.exports = LaporanController