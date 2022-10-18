const AdminController = require("../apps/admins/controller")
const UserController = require("./controller")

module.exports = (app) => {
  app.use("/v1/login", UserController)
  app.use("/v1/admin", AdminController)
}