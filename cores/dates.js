exports.generateJam = async () => {
  const date = new Date()
  const jam = String(date.getHours()).padStart(2, "0")
  const menit = String(date.getMinutes()).padStart(2, "0")
  const sekon = String(date.getSeconds()).padStart(2, "0")
  const time = `${jam}:${menit}:${sekon}`
  return time;
}

exports.generateTanggal = async () => {
  const date = new Date();
  const tahun = String(date.getFullYear())
  const bulan = String(date.getMonth()+1).padStart(2, "0")
  const hari = String(date.getDate()).padStart(2, "0")
  const time = `${tahun}-${bulan}-${hari}`
  return time
}