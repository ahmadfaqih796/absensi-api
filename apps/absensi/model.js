const MongoDB = require("../../cores/database")

const AbsensiModel = MongoDB.model("Absensi",
  MongoDB.Schema({
    kodeAbsen: {
      type: String,
      required: true,
    },
    nik: {
      type: String,
      required: true,
    },
    date:{
      type: String,
      required: true,
    },
    jamMasuk: {
      type: String,
      required: true,
    },
    jamPulang: {
      type: String
    }
  })
)

module.exports = AbsensiModel