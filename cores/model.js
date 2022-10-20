const MongoDB = require("./database")

const UserModel = MongoDB.model("User",
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
    nik: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["L", "P"],
      default: "L",
    },
    departemen: {
      type: String,
      required: true,
    },
    isSPV: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
    },
    alamat: {
      type: String,
      required: true,
    },
    tanggalMasuk: {
      type: String,
    },
    tahunBulanMasuk: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    jamMasuk: {
      type: String,
      default: "08:00:00"
    },
    jamKeluar: {
      type: String,
      default: "17:00:00"
    }
  }))

module.exports = UserModel;