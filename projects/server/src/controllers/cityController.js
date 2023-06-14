const { db, query } = require("../config/db");

module.exports = {
  getCities: async (req, res, next) => {
    try {
      const getCitiesQuery = await query(`SELECT * FROM cities`);

      return res.status(200).send({ data: getCitiesQuery });
    } catch (error) {
      next(error);
    }
  },
};
