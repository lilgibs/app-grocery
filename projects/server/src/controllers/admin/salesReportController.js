const { db, query } = require("../../config/db");
const { validationResult } = require("express-validator");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../utils/errorHandlers");

module.exports = {
  getAllSalesReport: async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const sortType = req.query.sortType;
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

      if (sortType && sortOrder) {
        productQuery += ` ORDER BY ${
          sortType === "date" ? "p.product_price" : "p.product_name"
        } ${sortOrder}`;
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
  getSalesReportByStoreId: async (req, res, next) => {
    // const { adminRole } = req.admin;
    const { store_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const sortType = req.query.sortType;
    const sortOrder = req.query.sortOrder;
    let salesReportQuery;
    let countQuery;

    try {
      if (store_id == 1360) {
        salesReportQuery = `
          SELECT o.order_id, u.name, o.total_price, o.order_date FROM orders o
          INNER JOIN users u on o.user_id = u.user_id
          WHERE o.order_status = ${db.escape("completed")}`;

        countQuery = `SELECT COUNT(*) as total
          FROM orders o
          INNER JOIN users u on o.user_id = u.user_id
          WHERE o.order_status = ${db.escape("completed")}`;
      } else {
        salesReportQuery = `
          SELECT o.order_id, u.name, o.total_price, o.order_date FROM orders o
          INNER JOIN users u on o.user_id = u.user_id
          WHERE store_id = ${db.escape(
            store_id
          )} AND o.order_status = ${db.escape("completed")}`;

        countQuery = `SELECT COUNT(*) as total
          FROM orders o
          INNER JOIN users u on o.user_id = u.user_id
          WHERE store_id = ${db.escape(
            store_id
          )} AND o.order_status = ${db.escape("completed")}`;
      }

      if (startDate && endDate) {
        salesReportQuery += ` AND o.order_date >= ${db.escape(
          startDate
        )} AND o.order_date <= ${db.escape(endDate)}`;
        countQuery += ` AND o.order_date >= ${db.escape(
          startDate
        )} AND o.order_date <= ${db.escape(endDate)}`;
      }

      if (sortType && sortOrder) {
        salesReportQuery += ` ORDER BY ${
          sortType === "date" ? "o.order_id" : "o.total_price"
        } ${sortOrder}`;
      } else {
        salesReportQuery += ` ORDER BY o.order_id DESC`;
      }

      salesReportQuery += ` LIMIT ${limit} OFFSET ${offset}`;

      const [resultsalesReportQuery, resultCountQuery] = await Promise.all([
        query(salesReportQuery),
        query(countQuery),
      ]);

      const total = resultCountQuery[0].total;

      res.status(200).json({
        message: "Sales Report fetched successfully",
        data: resultsalesReportQuery,
        total: total,
      });
    } catch (error) {
      handleServerError(error, next);
      console.log(error);
    }
  },
  getOrderDetailsByOrderId: async (req, res, next) => {
    try {
      const { order_id } = req.params;

      const getOrderDetailQuery = `
        SELECT o.store_id, o.order_id, od.order_detail_id, p.product_name, od.quantity, p.product_price, u.name FROM order_details od
        INNER JOIN orders o on od.order_id = o.order_id
        INNER JOIN products p on od.product_id = p.product_id
        INNER JOIN users u on o.user_id = u.user_id
        WHERE o.order_status = ${db.escape(
          "completed"
        )} AND o.order_id = ${db.escape(order_id)}`;

      const resultGetOrderDetailQuery = await query(getOrderDetailQuery);

      return res.status(200).json({
        message: "Order Details fetched successfully",
        data: resultGetOrderDetailQuery,
      });
    } catch (error) {
      handleServerError(error, next);
      console.log(error);
    }
  },
};
