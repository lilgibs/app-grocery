const { response } = require("express");
const { db, query } = require("../config/db");

module.exports = {
  getOrdersAsc: async (req, res, next) => {
    try {
      let userId = req.query.userId;

      const orderQuery = await query(`
      SELECT
        o.*,
        s.store_name,
        a.street
      FROM
        orders o
      INNER JOIN stores s ON o.store_id = s.store_id
      INNER JOIN addresses a ON o.address_id = a.address_id
      WHERE
        o.user_id = ${db.escape(userId)}  
      
      `);

      res.status(200).send(orderQuery);
    } catch (error) {
      next(error);
    }
  },
  getOrdersByStatus: async (req, res, next) => {
    try {
      const userId = req.query.userId;
      const orderStatus = req.query.orderStatus.toString();
      const page = parseInt(req.query.page) || 1;
      const limit = 3;

      const orderQuery = await query(`
      SELECT
        o.*,
        s.store_name,
       a.street
      FROM
        orders o
      INNER JOIN stores s ON o.store_id = s.store_id
      INNER JOIN addresses a ON o.address_id = a.address_id
      WHERE
        o.user_id = ${db.escape(userId)} AND
        o.order_status = ${db.escape(orderStatus)}`);

      orderQuery.sort((a, b) => b.order_id - a.order_id); // sort order in descending order

      // pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedOrder = orderQuery.slice(startIndex, endIndex);

      const maxPages = Math.ceil(orderQuery.length / limit);

      res.status(200).send({ orders: paginatedOrder, maxPages: maxPages });
    } catch (error) {
      next(error);
    }
  },
  getOrdersByInvoice: async (req, res, next) => {
    try {
      let userId = req.query.userId;
      let orderId = req.query.orderId;
      const orderQuery = await query(`
      SELECT
        o.*,
        s.store_name,
        a.street
      FROM
       orders o
      INNER JOIN stores s ON o.store_id = s.store_id
      INNER JOIN addresses a ON o.address_id = a.address_id
        WHERE
        o.user_id = ${db.escape(userId)} AND
        o.order_id = ${db.escape(orderId)}`);

      if (orderQuery.length === 0) {
        res.status(200).send({ data: orderQuery, message: "Order doesn't exist" });
      }

      orderQuery.sort((a, b) => b.order_id - a.order_id); // sort order in descending order

      res.status(200).send({ data: orderQuery, message: "Order fetched" });
    } catch (error) {
      next(error);
    }
  },
  getOrdersByDate: async (req, res, next) => {
    try {
      const userId = req.query.userId;
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;
      const page = parseInt(req.query.page) || 1;
      const limit = 3;

      const orderQuery = await query(`
        SELECT
          o.*,
          s.store_name,
          a.street
        FROM
          orders o
        INNER JOIN stores s ON o.store_id = s.store_id
        INNER JOIN addresses a ON o.address_id = a.address_id
        WHERE
        o.user_id = ${db.escape(userId)} AND
          o.order_date >= ${startDate} AND
          o.order_date <= ${endDate}`);

      orderQuery.sort((a, b) => b.order_id - a.order_id); // sort order in descending order

      // pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedOrder = orderQuery.slice(startIndex, endIndex);

      const maxPages = Math.ceil(orderQuery.length / limit);

      res.status(200).send({ orders: paginatedOrder, maxPages: maxPages });
    } catch (error) {
      next(error);
    }
  },
};
