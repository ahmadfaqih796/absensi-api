const jwt = require("jsonwebtoken");
const KaryawanModel = require("./model");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let user = await jwt.verify(token, process.env.PROJECT_KEY);
    req.user = await KaryawanModel.findOne({
      email: user.email,
    });
    next();
  } catch (error) {
    return res.status(401).json({
      message: "klien dilarang mengakses url yang valid",
    });
  }
};