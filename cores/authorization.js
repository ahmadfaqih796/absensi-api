const config = require("dotenv")
const jwt = require("jsonwebtoken")
const UserModel = require("./model")

config();

//Checking the Token's Authentication
exports.isAuthorized = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    let user = await jwt.verify(token, process.env.PROJECT_KEY)
    req.user = await UserModel.findOne({username: user.username})
    next();
  } catch (error) {
    return res.status(401).json({message: "User Dilarang Mengakses URL Ini"})
  }
}

//Agar hanya Admin yang bisa akses
exports.isAdmin = async (req, res, next) => {
  
}
