const {config} = require("dotenv")
const MongoDB = require("mongoose")

config();

module.exports = (() => {
  MongoDB.connect(process.env.MONGO_URI);
  return MongoDB;
})()