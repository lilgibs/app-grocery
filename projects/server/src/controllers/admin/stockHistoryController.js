const { db, query } = require("../../config/db");
const { validationResult } = require("express-validator");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../utils/errorHandlers");

module.exports = {
  getStockHistory: async (req, res, next) => {
    const { store_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const product = req.query.product;
    const sortOrder = req.query.sortOrder;

    try {
      let stockHistoryQuery = `
      SELECT si.store_id, p.product_name, sh.quantity_change, sh.change_type, sh.change_date FROM stock_history sh
      INNER JOIN store_inventory si on sh.store_inventory_id = si.store_inventory_id
      INNER JOIN products p on si.product_id = p.product_id WHERE si.store_id = ${db.escape(
        store_id
      )}`;

      let countQuery = `SELECT COUNT(*) as total
      FROM stock_history sh
      INNER JOIN store_inventory si on sh.store_inventory_id = si.store_inventory_id
      INNER JOIN products p on si.product_id = p.product_id WHERE si.store_id = ${db.escape(
        store_id
      )}`;

      if (startDate && endDate) {
        stockHistoryQuery += ` AND change_date >= ${db.escape(
          startDate
        )} AND change_date <= ${db.escape(endDate)}`;
        countQuery += ` AND change_date >= ${db.escape(
          startDate
        )} AND change_date <= ${db.escape(endDate)}`;
      }

      if (product) {
        stockHistoryQuery += ` AND p.product_name LIKE ${db.escape(
          "%" + product + "%"
        )}`;
        countQuery += ` AND p.product_name LIKE ${db.escape(
          "%" + product + "%"
        )}`;
      }

      if (sortOrder) {
        stockHistoryQuery += ` ORDER BY stock_history_id ${sortOrder}`;
      } else {
        stockHistoryQuery += ` ORDER BY stock_history_id DESC`;
      }

      stockHistoryQuery += ` LIMIT ${limit} OFFSET ${offset}`;

      const [resultstockHistoryQuery, resultCountQuery] = await Promise.all([
        query(stockHistoryQuery),
        query(countQuery),
      ]);

      const total = resultCountQuery[0].total;

      res.status(200).json({
        message: "Products fetched successfully",
        data: resultstockHistoryQuery,
        total: total,
      });
    } catch (error) {
      handleServerError(error, next);
      console.log(error);
    }
  },
};
