const MongoDB = require("../../cores/database");

const AbsensiModel = MongoDB.model(
  "Absensi",
  MongoDB.Schema({
    kodeAbsen: {
      type: String,
      required: true,
    },
    nik: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      require: true,
    },
    date: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      require: true,
    },
    jamMasuk: {
      type: String,
      required: true,
    },
    jamPulang: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  })
);

module.exports = AbsensiModel;
