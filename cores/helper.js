exports.generateKodeAbsen = async (nik, prefix, tanggal) => {
  let data = `${nik}${prefix.toUpperCase()}-${tanggal}`
  return data;
}

exports.generateNIK = async(tahunBulan, schema) => {
  let counter = await schema.find({tahunBulan}).count();
  let count = String(counter+1).padStart(2, "0")
  let nik = String(tahunBulan)+count
  return nik;
}