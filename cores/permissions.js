const jwt = require("jsonwebtoken");
const AdminModel = require("./model");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let user = await jwt.verify(token, process.env.PROJECT_KEY);
    req.user = await AdminModel.findOne({
      email: user.email,
    });
    next();
  } catch (error) {
    return res.status(401).json({
      message: "klien dilarang mengakses url yang valid",
    });
  }
};