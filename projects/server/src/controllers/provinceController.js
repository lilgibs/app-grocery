const { db, query } = require("../config/db");
const { handleServerError } = require("../utils/errorHandlers");

module.exports = {
  getProvinces: async (req, res, next) => {
    try {
      const getProvincesQuery = await query(`SELECT * FROM provinces`);

      return res.status(200).send({ data: getProvincesQuery });
    } catch (error) {
      handleServerError(error, next);
    }
  },
};
