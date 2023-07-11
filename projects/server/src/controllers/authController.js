const { db, query } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodemailer");
const { validationResult } = require("express-validator");
const ejs = require("ejs");
const path = require("path");
const {
  handleValidationErrors,
  handleServerError,
} = require("../utils/errorHandlers");

module.exports = {
  register: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      handleValidationErrors(errors);

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

      const renderEmailTemplate = (templatePath, data) => {
        const filePath = path.join(__dirname, templatePath);
        return ejs.renderFile(filePath, data);
      };

      const template = await renderEmailTemplate(
        "../templates/accountVerification.ejs",
        { name, token }
      );

      const mail = {
        from: `Admin <ichsannuriman12@gmail.com>`,
        to: `${email}`,
        subject: `Acount Verification`,
        html: template,
      };

      const response = await transporter.sendMail(mail);

      return res
        .status(201)
        .send({ data: addUserResult, message: "Register success" });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  verification: async (req, res, next) => {
    try {
      const id = req.user.id;

      const checkAccountQuery = `SELECT * FROM users WHERE user_id=${db.escape(
        id
      )}`;
      const isAccountExist = await query(checkAccountQuery);

      if (isAccountExist[0].is_verified == true) {
        throw {
          status_code: 400,
          message: "Account has been verified before.",
        };
      }

      const updateIsActiveQuery = `UPDATE users SET is_verified = true WHERE user_id = ${db.escape(
        id
      )}`;
      let updateResponse = await query(updateIsActiveQuery);

      return res.status(200).send({ message: "Account is verified" });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  login: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      handleValidationErrors(errors);

      const { email, password } = req.body;
      const isEmailExist = await query(
        `SELECT * FROM users WHERE email=${db.escape(email)}`
      );
      if (isEmailExist.length == 0) {
        throw {
          status_code: 400,
          message: "Email or password is incorrect",
        };
      }

      const isValid = await bcrypt.compare(password, isEmailExist[0].password);

      if (!isValid) {
        throw {
          status_code: 400,
          message: "Email or password is incorrect",
        };
      }

      if (isEmailExist[0].is_verified == false) {
        throw {
          status_code: 400,
          message: "Account is not verified yet, check your email",
        };
      }

      const payload = {
        id: isEmailExist[0].user_id,
      };

      const token = jwt.sign(payload, "joe", { expiresIn: "2h" });

      return res.status(200).send({
        message: "Login Success",
        token,
        data: {
          user_id: isEmailExist[0].user_id,
          name: isEmailExist[0].name,
          email: isEmailExist[0].email,
          phone_number: isEmailExist[0].phone_number,
          is_verified: isEmailExist[0].is_verified,
          gender: isEmailExist[0].gender,
          birthdate: isEmailExist[0].birthdate,
          profile_picture: isEmailExist[0].profile_picture,
        },
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  checkLogin: async (req, res, next) => {
    try {
      const users = await query(
        `SELECT * FROM users WHERE user_id = ${db.escape(req.user.id)}`
      );

      return res.status(200).send({
        data: {
          user_id: users[0].user_id,
          name: users[0].name,
          email: users[0].email,
          phone_number: users[0].phone_number,
          gender: users[0].gender,
          birthdate: users[0].birthdate,
          profile_picture: users[0].profile_picture,
          is_verified: users[0].is_verified,
        },
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  resetPasswordEmail: async (req, res, next) => {
    try {
      const { email } = req.body;

      const getEmailQuery = `SELECT * FROM users WHERE email=${db.escape(
        email
      )}`;
      const isEmailExist = await query(getEmailQuery);
      if (isEmailExist.length == 0) {
        throw { status_code: 400, message: "This email is not registered" };
      }

      let payload = { email: email };
      const token = jwt.sign(payload, "joe", { expiresIn: "1h" });

      const renderEmailTemplate = (templatePath, data) => {
        const filePath = path.join(__dirname, templatePath);
        return ejs.renderFile(filePath, data);
      };

      const template = await renderEmailTemplate(
        "../templates/resetPassword.ejs",
        { token }
      );

      const mail = {
        from: `Admin <ichsannuriman12@gmail.com>`,
        to: `${email}`,
        subject: `Reset Password`,
        html: template,
      };

      const response = await transporter.sendMail(mail);

      return res.status(200).send({
        message:
          "A verification has been sent to your email. Check your email to proceed.",
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      handleValidationErrors(errors);

      const { email } = req.user;
      const { newPassword } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);

      const updatePasswordQuery = await query(
        `UPDATE users
        SET
          password = ${db.escape(hashPassword)}
        WHERE
          email = ${db.escape(email)}`
      );

      return res
        .status(200)
        .send({ message: "Password changed successfully." });
    } catch (error) {
      next(error);
      // handleServerError(error, next);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      handleValidationErrors(errors);

      const { user_id } = req.params;
      const { oldPassword, newPassword } = req.body;

      const getPasswordQuery = await query(
        `SELECT password FROM users WHERE user_id = ${db.escape(user_id)}`
      );

      const passwordCompare = await bcrypt.compare(
        oldPassword,
        getPasswordQuery[0].password
      );

      if (!passwordCompare) {
        throw {
          status_code: 400,
          message: "Old password did not match.",
        };
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);

      const updatePasswordQuery = await query(
        `UPDATE users
        SET
          password = ${db.escape(hashPassword)}
        WHERE
          user_id = ${db.escape(user_id)}`
      );

      return res
        .status(200)
        .send({ message: "Password changed successfully." });
    } catch (error) {
      handleServerError(error, next);
    }
  },
};
