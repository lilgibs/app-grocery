const { db, query } = require("../config/db");

module.exports = {
  getProvinces: async (req, res, next) => {
    try {
      const getProvincesQuery = await query(`SELECT * FROM provinces`);

      return res.status(200).send({ data: getProvincesQuery });
    } catch (error) {
      next(error);
    }
  },
};
