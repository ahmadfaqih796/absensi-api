const jwt = require("jsonwebtoken")

exports.generateKode = async (nik, prefix, tanggal, counter) => {
  let data;
  if (prefix === "ABSEN") {
    data = `${nik}.${prefix.toUpperCase()}.${tanggal}`
  }
  if (prefix === "LAPOR") {
    data = `${nik}.${prefix.toUpperCase()}.${tanggal}.${counter}`
  }
  return data;
}

exports.generateNIK = async (tahunBulan, schema) => {
  let counter = await schema.find({ tahunBulan }).count();
  let count, nik;
  if (counter === 0) {
    count = String(counter + 1).padStart(2, "0")
    nik = String(tahunBulan) + count
  }
  else {
    let max = await schema.find({}).sort({ "nik": -1 }).limit(1)
    let maxNik = max[0].nik
    nik = String(parseInt(maxNik) + 1)
  }
  return nik;
}

exports.generateTanggal = async () => {
  const date = new Date();
  const tahun = String(date.getFullYear())
  const bulan = String(date.getMonth() + 1).padStart(2, "0")
  const hari = String(date.getDate()).padStart(2, "0")
  const time = `${tahun}-${bulan}-${hari}`
  return time
}

exports.generateJam = async () => {
  const date = new Date()
  const jam = String(date.getHours()).padStart(2, "0")
  const menit = String(date.getMinutes()).padStart(2, "0")
  const sekon = String(date.getSeconds()).padStart(2, "0")
  const time = `${jam}:${menit}:${sekon}`
  return time;
}

exports.getUser = async (req) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  let user = await jwt.verify(token, process.env.PROJECT_KEY)
  return user;
}

exports.cekJadwalMasuk = async (masuk) => {
  let jam = parseInt(masuk && masuk.split(":")[0])
  let menit = parseInt(masuk && masuk.split(":")[1]) + 1
  let sekon = parseInt(masuk && masuk.split(":")[2])
  let jamString = String(jam).padStart(2, "0")
  let menitString = String(menit).padStart(2, "0")
  let sekonString = String(sekon).padStart(2, "0")
  let jadwalMasuk = `${jamString}:${menitString}:${sekonString}`
  let jadwal = await this.validasiJam(jadwalMasuk)
  return jadwal
}

exports.validasiJam = async (time) => {
  let jam = parseInt(time && time.split(":")[0])
  let menit = parseInt(time && time.split(":")[1])
  let sekon = parseInt(time && time.split(":")[2])
  let tambahanjam = 0, tambahanmenit = 0;
  if (sekon >= 60) {
    tambahanmenit = sekon / 60
    sekon = sekon % 60
    menit = menit + tambahanmenit
  }
  if (menit >= 60) {
    tambahanjam = menit / 60
    menit = menit % 60
    jam = jam + tambahanjam
  }
  if (jam >= 24) {
    jam = jam - 24
  }
  let jamString = String(jam).padStart(2, "0")
  let menitString = String(menit).padStart(2, "0")
  let sekonString = String(sekon).padStart(2, "0")
  let jadwalMasuk = `${jamString}:${menitString}:${sekonString}`
  return jadwalMasuk
}

exports.cekFormatJam = async (time) => {
  let jam = parseInt(time && time.split(":")[0])
  let menit = parseInt(time && time.split(":")[1])
  let sekon = parseInt(time && time.split(":")[2])

  if (jam >= 24 || jam < 0) {
    return null
  }
  if (menit >= 60 || menit < 0) {
    return null
  }
  if (sekon >= 60 || sekon < 0) {
    return null
  }
  let jamString = String(jam).padStart(2, "0")
  let menitString = String(menit).padStart(2, "0")
  let sekonString = String(sekon).padStart(2, "0")
  let jadwalMasuk = `${jamString}:${menitString}:${sekonString}`
  return jadwalMasuk
}