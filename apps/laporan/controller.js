const express = require("express")
const LaporanController = express.Router()
const UserModel = require("../../cores/model")
const LaporanModel = require("./model")
const { generateKode } = require("../../cores/helper")
const { generateJam, generateTanggal } = require("../../cores/dates")

LaporanController.post("", async (req, res) => {

})

module.exports = LaporanController