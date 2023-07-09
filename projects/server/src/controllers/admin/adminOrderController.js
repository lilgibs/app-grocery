const { db, query } = require("../../config/db");
const { validationResult } = require("express-validator");
const { handleValidationErrors, handleServerError } = require("../../utils/errorHandlers");

module.exports = {
  getStoreOrders: async (req, res, next) => {
    try {
      let storeId = req.query.storeId;

      const orderQuery = await query(`
          SELECT * FROM orders
          WHERE store_id = ${db.escape(storeId)}`);

      res.status(200).send(orderQuery);
    } catch (error) {
      next(error);
    }
  },
  confirmOrder: async (req, res, next) => {
    try {
      let orderId = req.query.orderId;

      const confirmOrderQuery = await query(`
        UPDATE orders
        SET
            order_status = "Processed"
        WHERE
            order_id = ${db.escape(orderId)}
        `);

      res.status(200).send({
        message: "Order confirmed",
        data: confirmOrderQuery,
      });
    } catch (error) {
      next(error);
    }
  },
  rejectOrder: async (req, res, next) => {
    try {
      let orderId = req.query.orderId;

      const rejectOrderQuery = await query(`
        UPDATE orders
        SET
            payment_proof = "REJECTED",
            order_status = "Waiting for payment"
        WHERE
            order_id = ${db.escape(orderId)}
        `);

      res.status(200).send({
        message: "Order rejected",
        data: rejectOrderQuery,
      });
    } catch (error) {
      next(error);
    }
  },
  sendOrder: async (req, res, next) => {
    try {
      let orderId = req.query.orderId;

      const sendOrderQuery = await query(`
        UPDATE orders
        SET
            order_status = "Out for delivery"
        WHERE
            order_id = ${db.escape(orderId)}
        `);

      res.status(200).send({
        message: "Order is out for delivery",
        data: sendOrderQuery,
      });
    } catch (error) {
      next(error);
    }
  },

  //   cancelOrder: async (req, res, next) => {
  //     try {
  //       const orderId = req.query.orderId;

  //       //1. cari di table order_details, order dengan order id yg dipilih
  //       const orderDetails = await query(
  //         `SELECT * FROM order_details
  //           WHERE order_id = ${db.escape(orderId)}`
  //       );

  //       orderDetails.forEach(async (order) => {
  //         console.log(order.product_id);
  //         console.log(order.quantity);

  //         // 2. Update stock di table store_inventory
  //         const updateInventoryStockQuery = await query(
  //           `UPDATE store_inventory
  //           SET
  //             quantity_in_stock = quantity_in_stock + ${db.escape(order.quantity)}
  //           WHERE product_id = ${db.escape(order.product_id)}`
  //         );

  //         // 3. record perubahan stock di history
  //         const quantityChangeHistoryQuery = await query(`
  //         INSERT INTO stock_history(store_id, product_id, quantity_change, change_date, change_type)
  //           SELECT
  //             orders.store_id,
  //             ${db.escape(order.product_id)},
  //             ${db.escape(order.quantity)},
  //             orders.order_date,
  //             "add"
  //           FROM orders
  //           WHERE order_id = ${db.escape(orderId)}`);
  //       });

  //       // 4. ubah status order menjadi "canceled" di table orders
  //       const cancelOrderQuery = await query(
  //         `UPDATE orders
  //         SET
  //           order_status = "Canceled"
  //         WHERE
  //           order_id = ${db.escape(orderId)}`
  //       );

  //       res.status(200).send({
  //         message: `Order #${orderId} canceled.`,
  //         data: cancelOrderQuery,
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   },
};
