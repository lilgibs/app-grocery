const { db, query } = require("../config/db");

module.exports = {
  getOrdersAsc: async (req, res, next) => {
    try {
      let userId = req.query.userId;

      const orderQuery = await query(`
        SELECT * FROM orders
        WHERE user_id = ${db.escape(userId)}`);

      res.status(200).send(orderQuery);
    } catch (error) {
      next(error);
    }
  },
  getOrdersByStatus: async (req, res, next) => {
    try {
      let userId = req.query.userId;
      let orderStatus = req.query.orderStatus.toString();
      const orderQuery = await query(`
        SELECT * FROM orders
        WHERE
        user_id = ${db.escape(userId)} AND
        order_status = ${db.escape(orderStatus)}`);

      orderQuery.sort((a, b) => b.order_id - a.order_id); // sort order in descending order

      res.status(200).send(orderQuery);
    } catch (error) {
      next(error);
    }
  },
  getOrdersByInvoice: async (req, res, next) => {
    try {
      let userId = req.query.userId;
      let orderId = req.query.orderId;
      const orderQuery = await query(`
        SELECT * FROM orders
        WHERE
        user_id = ${db.escape(userId)} AND
        order_id = ${db.escape(orderId)}`);

      if (orderQuery.length === 0) {
        res.status(200).send({ data: orderQuery, message: "Order doesn't exist" });
      }

      orderQuery.sort((a, b) => b.order_id - a.order_id); // sort order in descending order

      res.status(200).send({ data: orderQuery, message: "Order fetched" });
    } catch (error) {
      next(error);
    }
  },
};
