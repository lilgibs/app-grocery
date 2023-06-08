const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Access Denied");
  }

  token = token.split(" ")[1];
  if (token == "null" || !token) {
    return res.status(401).send("Access Denied");
  }

  jwt.verify(token, "joe", (err, decoded) => {
    if (err) {
      throw { status_code: 400, message: err.message };
    }

    req.user = decoded;
  });
  next();
};

module.exports = { verifyToken };
