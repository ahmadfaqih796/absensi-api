const AdminController = require("./controller")

module.exports = (app) => {
  app.use("/v1/admin", AdminController)
}