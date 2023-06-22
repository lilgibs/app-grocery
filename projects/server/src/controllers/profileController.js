const { db, query } = require("../config/db");

module.exports = {
  editProfile: async (req, res, next) => {
    try {
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
      next(error);
    }
  },
};
