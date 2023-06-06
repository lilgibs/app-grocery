const { db, query } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("../config/nodemailer");
const { validationResult } = require("express-validator");

module.exports = {
  adminLogin: async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw {
          status_code: 400,
          message: "Format error at backend",
          errors: errors.array(),
        };
      }

      const { email, password } = req.body;

      const isEmailExist = await query(
        `SELECT * FROM admins WHERE email=${db.escape(email)}`
      );

      if (isEmailExist.length == 0) {
        // return res.status(400).send({ message: "You are not registered as an admin" });
        throw {
          status_code: 400,
          message: "You are not registered as an admin",
        };
      }

      // const isValid = await bcrypt.compare(password, isEmailExist[0].password);

      // if (!isValid) {
      //   return res.status(400).send({ message: "Email or Password is incorrect" });
      // }

      let payload = { adminId: isEmailExist[0].admin_id };

      const token = jwt.sign(payload, "joe", { expiresIn: "1h" });

      return res.status(200).send({
        message: "Admin login success",
        token,
        data: {
          id: isEmailExist[0].admin_id,
          name: isEmailExist[0].name,
          email: isEmailExist[0].email,
          name: isEmailExist[0].name,
          role: isEmailExist[0].role,
          store_id: isEmailExist[0].store_id,
          is_deleted: isEmailExist[0].is_deleted,
        },
      });
      // return res.status(200).send({ message: "Admin login test" });
    } catch (error) {
      // res.status(error.status || 500).send(error);

      // next({
      //   status_code: 500,
      //   message: "Error admin login",
      // });
      console.log(error);
      next(error);
    }
  },
  checkAdminLogin: async (req, res) => {
    try {
      //return res.status(200).send(req.body);
      const { email, password } = req.body;
      const admin = await query(
        `SELECT * FROM admins WHERE email=${db.escape(email)}`
      );

      if (admin[0].role == 0) {
        return res.status(200).send({
          message: "Super admin verified",
          data: {
            id: admin[0].admin_id,
            name: admin[0].name,
            email: admin[0].email,
            name: admin[0].name,
            role: admin[0].role,
            store_id: admin[0].store_id,
            is_deleted: admin[0].is_deleted,
          },
        });
      }

      return res.status(200).send({
        message: "Branch admin verified",
        data: {
          id: admin[0].admin_id,
          name: admin[0].name,
          email: admin[0].email,
          name: admin[0].name,
          role: admin[0].role,
          store_id: admin[0].store_id,
          is_deleted: admin[0].is_deleted,
        },
      });
    } catch (error) {
      res.status(error.status || 500).send(error);
    }
  },
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
