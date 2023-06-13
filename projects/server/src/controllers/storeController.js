const { db, query } = require("../config/db");

module.exports = {
  getStores: async (req, res, next) => {
    try {
      const sqlQuery = `SELECT * FROM stores WHERE is_deleted = 0 OR is_deleted IS NULL`;
      const result = await query(sqlQuery);

      res.status(200).json({
        message: "Successfully fetched all stores",
        data: result,
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
};
