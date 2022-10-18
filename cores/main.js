const AdminController = require("./controller")
const KaryawanController = require("../apps/karyawan/controllers")

module.exports = (app) => {
  app.use("/v1/admin", AdminController)
	app.use("/karyawan", KaryawanController)
}