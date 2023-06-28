const { db, query } = require("../config/db");
const { validationResult } = require("express-validator");
const {
  handleValidationErrors,
  handleServerError,
} = require("../utils/errorHandlers");
const path = require("path");
const fs = require("fs");

module.exports = {
  editProfile: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      handleValidationErrors(errors);

      const { user_id } = req.params;
      const { name, email, gender, birthdate } = req.body;

      const editProfileQuery = await query(
        `UPDATE users
        SET
          name = ${db.escape(name)},
          email = ${db.escape(email)},
          gender = ${db.escape(gender)},
          birthdate = ${db.escape(birthdate)}
        WHERE
          user_id = ${db.escape(user_id)}`
      );

      return res
        .status(200)
        .send({ message: "Edited successfuly", data: req.body });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  editPhotoProfile: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      handleValidationErrors(errors);
      const { user_id } = req.params;

      let profile_picture = "";
      if (req.file) {
        profile_picture = "uploads/" + req.file.filename;
      } else {
        throw {
          status_code: 400,
          message: "No file uploaded.",
          errors: errors.array(),
        };
      }

      const isPhotoExistQuery = await query(
        `SELECT profile_picture FROM users where user_id = ${db.escape(
          user_id
        )}`
      );

      const currentImagePath = isPhotoExistQuery[0]?.profile_picture;

      const editPhotoQuery = await query(
        `UPDATE users
        SET
          profile_picture = ${db.escape(profile_picture)}
        WHERE
          user_id = ${db.escape(user_id)}`
      );

      if (req.file && currentImagePath) {
        const absolutePath = path.resolve(
          __dirname,
          "..",
          "uploads",
          path.basename(currentImagePath)
        );
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }
      }

      res.status(201).json({
        message: "Edited photo profile",
        data: editPhotoQuery,
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
};
