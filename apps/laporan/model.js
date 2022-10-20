const MongoDB = require("../../cores/database")

const LaporanModel = MongoDB.model("Laporan",
  MongoDB.Schema({
    kodeLaporan: {
      type: String,
      required: true,
    },
    nik: {
      type: String,
      required: true,
    },
    tanggal: {
      type: String,
      required: true,
    },
    tugas: {
      type: String,
      required: true,
    },
    klien: {
      type: String,
      required: true,
    },
    jamMulai: {
      type: String,
    },
    jamAkhir: {
      type: String,
    },
    keterangan: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    }
  }))

module.exports = LaporanModel