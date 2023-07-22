const { db, query } = require("../config/db");
const { handleServerError } = require("../utils/errorHandlers");

module.exports = {
  getCities: async (req, res, next) => {
    try {
      const getCitiesQuery = await query(`SELECT * FROM cities`);

      return res.status(200).send({ data: getCitiesQuery });
    } catch (error) {
      handleServerError(error, next);
    }
  },
};
