const express = require("express")
const LaporanController = express.Router()
const UserModel = require("../../cores/model")
const LaporanModel = require("./model")
const { generateKode, getUser, generateTanggal, cekFormatJam } = require("../../cores/helper")
const { isAuthorized, isActive, isSPV } = require("../../cores/authorization")

const handleNIK = (req, res) => {
  let nik = req.params.nik;
  if (!nik) {
    res.status(400).json({ message: "Tidak ada Data yang Tersedia" })
  } else {
    return nik;
  }
}

const handleKodeLaporan = (req, res) => {
  let kodeLaporan = req.params.kodeLaporan
  if (!kodeLaporan) {
    res.status(400).json({ message: "Tidak ada Data yang Tersedia" })
  }
  else {
    return kodeLaporan;
  }
}

//untuk membuat laporan. Data User didapat dari token
LaporanController.post("/", [isAuthorized, isActive], async (req, res) => {
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
      name: user.name,
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
      let data = await LaporanModel.findOne({ kodeLaporan: kodeLaporan })
    }
    else {
      return res.status(400).json({ message: "Format Jam Tidak Sesuai <hh:mm:ss>" })
    }
  }
  return res.json({ message: "Laporan sudah berhasil diunggah" })
})

//untuk melihat data laporan, data user didapat dari token, hanya bisa diakses oleh SPV
//Menggunakan input body berupa tanggal
LaporanController.get("/", [isAuthorized, isSPV, isActive], async (req, res) => {
  let page = parseInt(req.query.page)
  let limit = (req.query.limit) ? (req.query.limit) : 10
  let user = await getUser(req)
  let tanggal = req.query.tanggal
  let total = await LaporanModel.find({ tanggal: tanggal, departemen: user.departemen }).count();
  let totalAll = await LaporanModel.find({ tanggal: tanggal }).count()
  let totalPage = Math.ceil(total / limit)
  let previousPage = (page > 1) ? (page - 1) : null
  let nextPage = (page < totalPage) ? (page + 1) : null
  let skip = (page * limit) - limit
  let data = await LaporanModel.find({ tanggal: tanggal, departemen: user.departemen }).lean()
    .limit(limit).skip(skip)
  res.json({ page, previousPage, nextPage, totalPage, data, totalAll })
})

//untuk melihat data laporan khusus dari satu user, 
//untuk melihat punya sendiri atau melihat orang dari departemen yang sama (untuk SPV)
LaporanController.get("/user/:nik", [isAuthorized, isSPV, isActive], async (req, res) => {
  let page = parseInt(req.query.page)
  let limit = (req.query.limit) ? (req.query.limit) : 10
  let nik = handleNIK(req, res)
  let user = await getUser(req)
  let target = await UserModel.findOne({ nik: nik })
  let tanggal = req.query.tanggal

  if (user.nik === target.nik) {
    let total = await LaporanModel.find({ nik: user.nik, tanggal: tanggal }).count()
    let totalPage = Math.ceil(total / limit)
    let previousPage = (page > 1) ? (page - 1) : null
    let nextPage = (page < totalPage) ? (page + 1) : null
    let skip = (page * limit) - limit
    let data = await LaporanModel.find({ nik: user.nik, tanggal: tanggal }).lean()
      .limit(limit).skip(skip)
    return res.json({ page, previousPage, nextPage, totalPage, data })
  }
  if (user.isSPV) {
    if (user.departemen === target.departemen) {
      let total = await LaporanModel.find({ nik: nik, tanggal: tanggal }).count()
      let totalPage = Math.ceil(total / limit)
      let previousPage = (page > 1) ? (page - 1) : null
      let nextPage = (page < totalPage) ? (page + 1) : null
      let skip = (page * limit) - limit
      let data = await LaporanModel.find({ nik: nik, tanggal: tanggal }).lean()
        .limit(limit).skip(skip)
      return res.json({ page, previousPage, nextPage, totalPage, data })
    }
    else {
      return res.json({ message: "Anda tidak berada dalam satu Departemen yang sama" })
    }
  }
  else {
    return res.json({ message: "Anda tidak memiliki Otorisasi untuk melihat Data Laporan ini" })
  }
})

//Untuk melihat satu laporan dari satu user
LaporanController.get("/user/:nik/laporan/:kodeLaporan", [isAuthorized, isActive], async (req, res) => {
  let nik = handleNIK(req, res)
  let kodeLaporan = handleKodeLaporan(req, res)
  let user = await getUser(req)
  let target = await UserModel.findOne({ nik: nik })
  if (user.nik === target.nik) {
    let data = await LaporanModel.findOne({ kodeLaporan: kodeLaporan, nik: user.nik })
    if (data) {
      return res.json({ data })
    }
    else {
      return res.json({ message: "Data yang Anda Cari Tidak Ditemukan" })
    }
  }
  if (user.isSPV) {
    if (user.departemen === target.departemen) {
      let data = await LaporanModel.findOne({ kodeLaporan: kodeLaporan, nik: target.nik })
      if (data) {
        return res.json({ data })
      }
      else {
        return res.json({ message: "Data yang Anda Cari Tidak Ditemukan" })
      }
    }
    else {
      return res.json({ message: "Anda tidak berada dalam satu Departemen yang sama" })
    }
  }
  else {
    return res.json({ message: "Anda tidak memiliki Otorisasi untuk melihat Data Laporan Ini" })
  }
})

//untuk mengubah data 1 laporan dari 1 user
//user dapat mengubah isi laporan (tugas, klien, dll)
//sementara SPV dapat mengubah status laporan tersebut
LaporanController.put("/user/:nik/laporan/:kodeLaporan", [isAuthorized, isActive], async (req, res) => {
  let nik = handleNIK(req, res)
  let kodeLaporan = handleKodeLaporan(req, res)
  let user = await getUser(req)
  let target = await UserModel.findOne({ nik: nik })
  if (user.nik === target.nik) {
    let data = await LaporanModel.findOne({ nik: user.nik, kodeLaporan: kodeLaporan })
    if (data) {
      await LaporanModel.findOneAndUpdate({ nik: user.nik, kodeLaporan: kodeLaporan }, ({
        tugas: req.body.tugas,
        klien: req.body.klien,
        jamMulai: req.body.jamMulai,
        jamAkhir: req.body.jamAkhir,
        keterangan: req.body.keterangan
      }))
      data = await LaporanModel.findOne({ nik: user.nik, kodeLaporan: kodeLaporan })
      return res.json({ data })
    }
    else {
      return res.json({ message: "Data yang Anda Cari Tidak Ditemukan" })
    }
  }
  if (user.isSPV) {
    if (user.departemen === target.departemen) {
      let data = await LaporanModel.findOne({ nik: target.nik, kodeLaporan: kodeLaporan })
      if (data) {
        await LaporanModel.findOneAndUpdate({ nik: target.nik, kodeLaporan: kodeLaporan }, ({
          status: req.body.status
        }))
        data = await LaporanModel.findOne({ nik: target.nik, kodeLaporan: kodeLaporan })
        return res.json({ data })
      }
      else {
        return res.json({ message: "Data yang Anda Cari Tidak Ditemukan" })
      }
    }
    else {
      return res.json({ message: "Anda tidak berada dalam satu Departemen yang sama" })
    }
  }
  else {
    return res.json({ message: "Anda tidak memiliki Otorisasi untuk melihat Data Laporan Ini" })
  }
})

LaporanController.delete("/user/:nik/laporan/:kodeLaporan", [isAuthorized, isActive], async (req, res) => {
  let nik = handleNIK(req, res)
  let kodeLaporan = handleKodeLaporan(req, res)
  let user = await getUser(req)
  let target = await UserModel.findOne({ nik: nik })
  if (user.nik === target.nik) {
    let data = await LaporanModel.findOne({ kodeLaporan: kodeLaporan })
    if (data) {
      await LaporanModel.findOneAndRemove({ nik: user.nik, kodeLaporan: kodeLaporan })
      return res.json({ message: "Data sudah Berhasil Dihapus", data })
    }
    else {
      return res.json({ message: "Data yang Anda Cari Tidak Ditemukan" })
    }
  }
  else {
    return res.json({ message: "Anda tidak Bisa Menghapus Data Ini" })
  }
})

module.exports = LaporanController