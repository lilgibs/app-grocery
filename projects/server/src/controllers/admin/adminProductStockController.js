const { db, query } = require("../../config/db");
const { validationResult } = require("express-validator");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../utils/errorHandlers");

module.exports = {
  increaseStock: async (req, res, next) => {
    const product_id = req.params.productId;
    const { product_stock } = req.body;
    const { adminStoreId } = req.admin;
    const errors = validationResult(req);

    try {
      handleValidationErrors(errors);

      const today = new Date();
      const currentDate = today.toISOString().slice(0, 10);

      const stockUpdateQuery = `UPDATE store_inventory 
        SET quantity_in_stock = quantity_in_stock + ${db.escape(product_stock)}
        WHERE 
          store_id = ${db.escape(adminStoreId)} AND
          product_id = ${db.escape(product_id)}
      `;

      const getStoreInventoryIdQuery = `SELECT store_inventory_id
        FROM store_inventory
        WHERE
          store_id = ${db.escape(adminStoreId)} AND
          product_id = ${db.escape(product_id)}
      `;

      const getStoreInventoryIdQueryResult = await query(
        getStoreInventoryIdQuery
      );

      const stockHistoryQuery = `INSERT INTO stock_history
        VALUES(null, ${db.escape(
          getStoreInventoryIdQueryResult[0].store_inventory_id
        )}, ${db.escape(product_stock)}, ${db.escape(currentDate)}, ${db.escape(
        "add"
      )})`;

      await query("START TRANSACTION");
      const stockUpdateQueryResult = await query(stockUpdateQuery);
      const stockHistoryQueryResult = await query(stockHistoryQuery);

      await query("COMMIT");
      res.status(200).json({
        message: "Stock has been successfully updated!",
      });
    } catch (error) {
      await query("ROLLBACK");

      console.log(error);
    }
  },
  decreaseStock: async (req, res, next) => {
    const product_id = req.params.productId;
    const { product_stock, store_inventory_id } = req.body;
    const { adminStoreId } = req.admin;
    const errors = validationResult(req);

    try {
      handleValidationErrors(errors);

      const today = new Date();
      const currentDate = today.toISOString().slice(0, 10);

      const currStockQuery = `SELECT quantity_in_stock FROM store_inventory
        WHERE
          store_inventory_id = ${db.escape(store_inventory_id)} AND
          store_id = ${db.escape(adminStoreId)} AND
          product_id = ${db.escape(product_id)}
      `;

      const currStockResult = await query(currStockQuery);

      // Check apakah stock input melebihi stock saat ini
      if (product_stock > currStockResult[0].quantity_in_stock) {
        throw {
          status_code: 400,
          message: "Insufficient stock.",
        };
      }

      const stockUpdateQuery = `UPDATE store_inventory 
        SET quantity_in_stock = quantity_in_stock - ${db.escape(product_stock)}
        WHERE 
          store_inventory_id = ${db.escape(store_inventory_id)} AND
          store_id = ${db.escape(adminStoreId)} AND
          product_id = ${db.escape(product_id)}
      `;

      // const getStoreInventoryIdQuery = `SELECT store_inventory_id
      //   FROM store_inventory
      //   WHERE
      //     store_id = ${db.escape(adminStoreId)} AND
      //     product_id = ${db.escape(product_id)}
      // `;

      // const getStoreInventoryIdQueryResult = await query(
      //   getStoreInventoryIdQuery
      // );

      const stockHistoryQuery = `INSERT INTO stock_history
        VALUES(null, ${db.escape(store_inventory_id)}, ${db.escape(
        product_stock
      )}, ${db.escape(currentDate)}, ${db.escape("deduct")})`;

      await query("START TRANSACTION");
      const stockUpdateQueryResult = await query(stockUpdateQuery);
      const stockHistoryQueryResult = await query(stockHistoryQuery);

      await query("COMMIT");
      res.status(200).json({ message: "Stock has been successfully updated!" });
    } catch (error) {
      await query("ROLLBACK");
      handleServerError(error, next);
      console.log(error);
    }
  },
};
