const { validationResult } = require("express-validator");
const { db, query } = require("../config/db");
const { handleServerError } = require("../utils/errorHandlers");

module.exports = {
  getCart: async (req, res, next) => {
    let userId = req.body.userId;

    try {
      const cartQuery = `SELECT store_inventory_id, quantity FROM cart WHERE user_id = ${db.escape(userId)}`;

      let resultCartQuery = await query(cartQuery);

      return res.status(200).send({
        message: "Cart fecthed succesfully",
        cart: resultCartQuery,
      });
    } catch {
      next;
    }
  },
};
