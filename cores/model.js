const MongoDB = require("./database")

const AdminModel = MongoDB.model("Admin",
  MongoDB.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    }
  }))

  module.exports = AdminModel;