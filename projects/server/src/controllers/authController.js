const { db, query } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("../config/nodemailer");
const { validationResult } = require("express-validator");

module.exports = {
  register: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw {
          status_code: 400,
          message: `${errors.array()[0].msg} (Backend)`,
          errors: errors.array(),
        };
      }

      const { name, email, password, phone } = req.body;

      const getEmailQuery = `SELECT * FROM users WHERE email=${db.escape(
        email
      )}`;
      const isEmailExist = await query(getEmailQuery);
      if (isEmailExist.length > 0) {
        throw { status_code: 400, message: "Email has been used" };
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const addUserQuery = `INSERT INTO users VALUES (null, ${db.escape(
        email
      )}, ${db.escape(hashPassword)}, ${db.escape(name)},null,null,${db.escape(
        phone
      )}, null, false, false)`;

      const addUserResult = await query(addUserQuery);

      let payload = { id: addUserResult.insertId };
      const token = jwt.sign(payload, "joe", { expiresIn: "4h" });

      const mail = {
        from: `Admin <admin@gmail.com>`,
        to: `${email}`,
        subject: `Acount Verification`,
        html: `
        <p>This is verification for your account in XYZ ecommerce site.</p>
      <a href="http://localhost:3000/verification/${token}">Click Here</a>`,
      };

      const response = await nodemailer.sendMail(mail);

      return res
        .status(200)
        .send({ data: addUserResult, message: "Register success" });
    } catch (error) {
      next(error);
    }
  },
};
