const express = require("express")
const LaporanController = express.Router()
const UserModel = require("../../cores/model")
const LaporanModel = require("./model")
const { generateKode, getUser, generateJam, generateTanggal } = require("../../cores/helper")

LaporanController.post("", async (req, res) => {
  let user = await getUser(req);

  return res.json(user)
})

module.exports = LaporanController