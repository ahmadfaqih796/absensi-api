const MongoDB = require("./database")

const KaryawanModel = MongoDB.model("Karyawan",
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
      unique: true,
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
    }
  }))

  module.exports = KaryawanModel;