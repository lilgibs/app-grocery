const { validationResult } = require("express-validator");
const { db, query } = require("../config/db");
const { handleServerError } = require("../utils/errorHandlers");

module.exports = {
  getCart: async (req, res, next) => {
    let userId = req.body.user_id;

    try {
      const cartQuery = `
      SELECT c.cart_id, si.product_id, p.product_name, p.product_price, c.quantity
      FROM cart c
      JOIN store_inventory si ON c.store_inventory_id = si.store_inventory_id
      JOIN products p ON si.product_id = p.product_id
      WHERE c.user_id = ${db.escape(userId)};
      `;
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
