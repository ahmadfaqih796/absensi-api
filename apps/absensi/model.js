const MongoDB = require("../../cores/database")

const AbsensiModel = MongoDB.model("Absensi",
  MongoDB.Schema({
    kodeabsen: {
      type: String,
    },
    // barcode: {
    //   type: String,
    // },
    nik: {
      type: String,
    },
    tanggal:{
      type: String,
      required: true,
    },
    jammasuk: {
      type: String,
      required: true,
    },
    jampulang: {
      type: String,
      required: true,
    }
  })
)