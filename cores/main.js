const AdminController = require("../apps/admins/controller")
const UserController = require("./controller")
const AbsensiController = require("../apps/absensi/controller")
const LaporanController = require("../apps/laporan/controller")

module.exports = (app) => {
  app.use("/login", UserController)
  app.use("/admin", AdminController)
  app.use("/absen", AbsensiController)
  app.use("/lapor", LaporanController)
}