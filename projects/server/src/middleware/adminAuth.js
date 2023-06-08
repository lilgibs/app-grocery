const jwt = require('jsonwebtoken');

const adminVerifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token is not valid." });
  }
}

module.exports = {
  adminVerifyToken
}