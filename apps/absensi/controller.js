const express = require("express");
const AbsensiController = express.Router();
const UserModel = require("../../cores/model");
const AbsensiModel = require("./model");
const {
  generateKode,
  cekJadwalMasuk,
  generateJam,
  generateTanggal,
} = require("../../cores/helper");
const {
  isAuthorized,
  isAdmin,
  isActive,
} = require("../../cores/authorization");

//untuk absen jam masuk
AbsensiController.post("/masuk", async (req, res) => {
  // const client = require("twilio")(process.env.SID, process.env.TOKEN);
  const dataKaryawan = await UserModel.findOne({ nik: req.body.nik });
  // kalau tidak ada data karyawan yang sesuai, kembalikan error
  if (!dataKaryawan) {
    return res.status(400).json({ message: "Data Karyawan Tidak Tersedia" });
  } //kalau ada data karyawan, periksa data absen
  else {
    // let notif = client.messages
    //   .create({
    //     from: `whatsapp:+14155238886`,
    //     body: `terima kasih anda sudah absen masuk\n,${dataKaryawan.name}`,
    //     to: `whatsapp:+6289657055232`,
    //   })
    //   .then((message) => console.log(message));
    let tanggal = await generateTanggal();
    let jam = await generateJam();
    let kodeAbsen = await generateKode(dataKaryawan.nik, "ABSEN", tanggal);
    const dataAbsen = await AbsensiModel.findOne({ kodeAbsen: kodeAbsen });
    const newAbsen = new AbsensiModel({
      kodeAbsen: kodeAbsen,
      nik: dataKaryawan.nik,
      name: dataKaryawan.name,
      // otp: notif,
      date: tanggal,
      jamMasuk: jam,
    });
    //kalau belum ada data absen, buat data absen untuk hari ini dan langsung catat jam
    if (!dataAbsen) {
      await newAbsen.save();
      //untuk cek jadwal jam masuk
      let jadwalMasuk = await cekJadwalMasuk(dataKaryawan.jamMasuk);
      if (jam > jadwalMasuk) {
        let data = await AbsensiModel.findOne({ kodeAbsen });
        return res.json({
          message: `Anda terlambat karena datang melebihi jam ${dataKaryawan.jamMasuk}`,
          data,
        });
      } //kalau datang terlambat
      else {
        let data = await AbsensiModel.findOne({ kodeAbsen });
        return res.json({ message: "Anda sudah Berhasil Absen Masuk", data });
      }
    } else {
      return res.json({
        message: "Anda sudah absen Masuk hari ini",
        dataAbsen,
      });
    }
  }
});

AbsensiController.put("/masuk/:nik", async (req, res) => {
  const dataKaryawan = await UserModel.findOne({ nik: req.body.nik });
  const client = require("twilio")(process.env.SID, process.env.TOKEN);
  // kalau tidak ada data karyawan yang sesuai, kembalikan error
  if (!dataKaryawan) {
    return res.status(400).json({ message: "Data Karyawan Tidak Tersedia" });
  } //kalau ada data karyawan, periksa data absen
  else {
    const data = await AbsensiModel.findOneAndUpdate(req.params.nik, req.body);
    res.json({ pesan: "berhasil mengedit data", data });
  }
});

AbsensiController.post("/pulang", async (req, res) => {
  const dataKaryawan = await UserModel.findOne({ nik: req.body.nik });
  // const client = require("twilio")(process.env.SID, process.env.TOKEN);
  //kalau tidak ada data karyawan yang sesuai
  if (!dataKaryawan) {
    return res.status(400).json({ message: "Data Karyawan Tidak Tersedia" });
  }
  //kalau data karyawan tersedia, periksa data absen
  else {
    // client.messages
    //   .create({
    //     from: `whatsapp:+14155238886`,
    //     body: `terima kasih anda sudah absen pulang\n,${dataKaryawan.name}`,
    //     to: `whatsapp:+6282182771538`,
    //   })
    //   .then((message) => console.log(message));
    let tanggal = await generateTanggal();
    let jam = await generateJam();
    let kodeAbsen = await generateKode(dataKaryawan.nik, "ABSEN", tanggal);
    const dataAbsen = await AbsensiModel.findOne({ kodeAbsen: kodeAbsen });
    //kalau belum ada data absen, berarti belum absen <= error
    if (!dataAbsen) {
      return res.json({ message: "Anda belum absen Masuk hari ini" });
    }
    //kalau sudah ada, cek apakah ada data jam pulang atau belum
    else {
      //kalau ada data jam pulang, tampilkan error
      if (dataAbsen.jamPulang) {
        return res.json({
          message: "Anda sudah absen Pulang hari ini",
          dataAbsen,
        });
      }
      //kalau belum ada data jam pulang, maka record jam pulang
      else {
        //kalau jam pulang sudah sesuai, boleh pulang
        if (jam >= dataKaryawan.jamKeluar) {
          await AbsensiModel.findOneAndUpdate(
            { kodeAbsen },
            {
              jamPulang: jam,
            }
          );
          let data = await AbsensiModel.findOne({ kodeAbsen });
          return res.json({
            message: "Anda berhasil absen Pulang hari ini",
            data,
          });
        } else {
          return res.json({
            message: `Anda belum boleh pulang sebelum sampai jam ${dataKaryawan.jamKeluar}`,
          });
        }
      }
    }
  }
});

//Untuk Melihat Daftar Absen Hari Ini, Hanya Bisa Diakses Oleh Admin Saja
AbsensiController.get("", [isAuthorized, isActive, isAdmin], async (req, res) => {
  let page = parseInt(req.query.page)
  let limit = (req.query.limit) ? (req.query.limit) : 10
  let total = await AbsensiModel.find({ date: tanggal }).count();
  let totalPage = Math.ceil(total / limit)
  let totalAll = await AbsensiModel.find({ date: tanggal }).count()
  let previousPage = (page > 1) ? (page - 1) : null
  let nextPage = (page < totalPage) ? (page + 1) : null
  let skip = (page * limit) - limit
  let tanggal = req.query.tanggal;
  let data = await AbsensiModel.find({ date: tanggal }).lean()
    .limit(limit).skip(skip)
  res.json({ page, previousPage, nextPage, totalPage, data, totalAll })
});

module.exports = AbsensiController;
