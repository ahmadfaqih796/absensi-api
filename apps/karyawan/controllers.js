// const express = require("express");
// const KaryawanModel = require("./models");

// const { isAuthenticated } = require("../../cores/permissions");

// const KaryawanController = express.Router();

// KaryawanController.get("/", [isAuthenticated], async (req, res) => {
// 	req.query = req.query && req.query.nama ? { nama: {$regex: req.query.nama, $options: 'i' } } : null
//   const data = await KaryawanModel.find(req.query);
//   return res.json(data);
// })

// KaryawanController.post("/", [isAuthenticated], async (req, res) => {
//   const data = req.body
//   const karyawan = new KaryawanModel(data);
//   await karyawan.save();
//   res.json({pesan: "Berhasil menyimpan costumer"})
// });



// module.exports = KaryawanController;
