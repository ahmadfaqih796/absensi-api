const config = require("dotenv")
const jwt = require("jsonwebtoken")
const UserModel = require("./model")
const { getUser } = require("./helper")
const e = require("express")

//Checking the Token's Authentication
exports.isAuthorized = async (req, res, next) => {
  try {
    let user = await getUser(req)
    req.user = await UserModel.findOne({ username: user.username })
    next();
  } catch (error) {
    return res.status(401).json({ message: "User Dilarang Mengakses URL Ini" })
  }
}

//Agar hanya bisa diakses oleh User yang masih aktif
exports.isActive = async (req, res, next) => {
  try {
    if (req.user.isActive) {
      next();
    }
    else {
      throw ({ message: "Akun Anda Sudah Tidak Aktif" })
    }
  }
  catch (error) {
    return res.status(401).json(error)
  }
}

//Agar hanya Admin yang bisa akses
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      next();
    }
    else {
      throw ({ message: "User Dilarang Mengakses URL Ini" })
    }
  }
  catch (error) {
    return res.status(401).json(error)
  }
}

//Agar hanya SPV yang bisa akses
exports.isSPV = async (req, res, next) => {
  try {
    if (req.user.isSPV) {
      next();
    }
    else {
      throw ({ message: "User Dilarang Mengakses URL Ini" })
    }
  }
  catch (error) {
    return res.status(401).json(error)
  }
}
