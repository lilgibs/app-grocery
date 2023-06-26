const { validationResult, check } = require("express-validator");
const { db, query } = require("../config/db");
const { handleServerError } = require("../utils/errorHandlers");
const { response } = require("express");

module.exports = {
  getCart: async (req, res, next) => {
    let userId = req.body.user_id;

    try {
      const cartQuery = `
      SELECT c.cart_id, si.product_id, p.product_name, p.product_price, c.quantity, si.quantity_in_stock, (p.product_price * c.quantity) AS subtotal
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
  addToCart: async (req, res, next) => {
    let userId = req.body.user_id;
    let productId = req.body.product_id;
    let quantity = req.body.quantity;

    try {
      const checkCartExistQuery = `
      SELECT *
      FROM cart
      WHERE user_id = ${db.escape(userId)} AND store_inventory_id = (
          SELECT store_inventory_id
          FROM store_inventory
          WHERE product_id = ${db.escape(productId)}
      )
      `;

      const updateInventoryStockQuery = `
      UPDATE store_inventory
      SET quantity_in_stock = quantity_in_stock - ${db.escape(quantity)}
      WHERE product_id = ${db.escape(productId)};
      `;

      let cartExist = await query(checkCartExistQuery);

      if (cartExist.length > 0) {
        //
        const updateCartQuantityQuery = `
        UPDATE cart
        SET quantity = quantity +  ${db.escape(quantity)}
        WHERE user_id =  ${db.escape(userId)} AND store_inventory_id = (
          SELECT store_inventory_id
          FROM store_inventory
          WHERE product_id =  ${db.escape(productId)});
        `;

        let resultUpdateCartQuantityQuery = await query(updateCartQuantityQuery);
        let updateInventoryStock = await query(updateInventoryStockQuery);

        return res.status(200).send({
          message: "Cart updated",
          data: resultUpdateCartQuantityQuery,
        });
        //
      }

      const addToCartQuery = `
      INSERT INTO cart (user_id, store_inventory_id, quantity)
      SELECT
          ${db.escape(userId)} AS user_id,
          si.store_inventory_id,
          ${db.escape(quantity)} AS quantity
      FROM
          store_inventory si
      JOIN
          products p ON si.product_id = p.product_id
      WHERE
          p.product_id =  ${db.escape(productId)};
      `;

      let resultAddToCartQuery = await query(addToCartQuery);
      let updateInventoryStock = await query(updateInventoryStockQuery);

      return res.status(200).send({
        message: "Added to cart",
        data: resultAddToCartQuery,
      });
    } catch {
      next;
    }
  },
  deleteFromCart: async (req, res, next) => {},
};
