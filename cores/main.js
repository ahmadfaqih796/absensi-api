const AdminController = require("../apps/admins/controller")
const UserController = require("./controller")

module.exports = (app) => {
  app.use("/login", UserController)
  app.use("/admin", AdminController)
}