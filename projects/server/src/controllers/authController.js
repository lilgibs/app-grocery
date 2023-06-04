const { db, query } = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  adminLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const isEmailExist = await query(`SELECT * FROM admins WHERE email=${db.escape(email)}`);
      if (isEmailExist.length == 0) {
        return res.status(400).send({ message: "You are not registered as an admin" });
      }

      let payload = { adminId: isEmailExist[0].admin_id };

      const token = jwt.sign(payload, "joe", { expiresIn: "1h" });

      return res.status(200).send({
        message: "Admin login success",
        token,
        data: { id: isEmailExist[0].admin_id, name: isEmailExist[0].name, email: isEmailExist[0].email, name: isEmailExist[0].name, role: isEmailExist[0].role, store_id: isEmailExist[0].store_id, is_deleted: isEmailExist[0].is_deleted },
      });
      // return res.status(200).send({ message: "Admin login test" });
    } catch (error) {
      res.status(error.status || 500).send(error);
    }
  },
};
