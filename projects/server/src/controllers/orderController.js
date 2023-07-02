const { db, query } = require("../config/db");
const { validationResult } = require("express-validator");
const { handleValidationErrors, handleServerError } = require("../utils/errorHandlers");

module.exports = {
  getOrders: async (req, res, next) => {
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
  addOrder: async (req, res, next) => {
    try {
      let userId = req.body.user_id;
      let storeId = req.body.store_id;
      let orderDate = req.body.order_date;
      let shippingCourier = req.body.shipping_courier;
      let shippingType = req.body.shipping_type;
      let shippingPrice = req.body.shipping_price;
      let totalPrice = req.body.total_price;
      let orderStatus = req.body.order_status;
      let addressId = req.body.address_id;

      // 1. menambah ke table order
      const addOrderQuery = await query(`
          INSERT INTO orders(user_id, store_id, order_date, shipping_courier, shipping_type, shipping_price, total_price, order_status, is_deleted, address_id)
          VALUES(${db.escape(userId)},
          ${db.escape(storeId)},
          ${db.escape(orderDate)},
          ${db.escape(shippingCourier)},
          ${db.escape(shippingType)},
          ${db.escape(shippingPrice)},
          ${db.escape(totalPrice)},
          ${db.escape(orderStatus)},
          0,
          ${db.escape(addressId)});
          `);

      // 2. kalau table order sdh bertambah, select order_id yg baru

      const orderIdQuery = `
        SELECT order_id FROM orders
        WHERE
          user_id=${db.escape(userId)} AND
          store_id=${db.escape(storeId)} AND
          order_date=${db.escape(orderDate.substring(0, orderDate.length - 9))} AND
          shipping_courier=${db.escape(shippingCourier)} AND
          shipping_type=${db.escape(shippingType)} AND
          shipping_price=${db.escape(shippingPrice)} AND
          total_price=${db.escape(totalPrice)} AND
          address_id=${db.escape(addressId)};`;

      const orderIds = await query(orderIdQuery);
      const orderId = orderIds[orderIds.length - 1].order_id; // choose the last ID (latest ID)

      // 3. Pindah items dari cart ke order_details
      let orderDetails = req.body.order_details;

      orderDetails.forEach(async (order) => {
        const addOrderDetailsQuery = await query(`
          INSERT INTO order_details(order_id, product_id, quantity, price)
          VALUES(
            ${db.escape(orderId)},
            ${db.escape(order.product_id)},
            ${db.escape(order.quantity)},
            ${db.escape(order.subtotal)})`);

        const deleteCartQuery = await query(`
          DELETE FROM cart WHERE
          cart_id = ${db.escape(order.cart_id)}`); // reset cart menjadi = 0

        // 4. update stock product
        const updateInventoryStockQuery = await query(`
          UPDATE store_inventory
          SET
            quantity_in_stock = quantity_in_stock - ${db.escape(order.quantity)}
          WHERE product_id = ${db.escape(order.product_id)}
          `);

        // 5. record perubahan sotck di history
        const quantityChangeHistoryQuery = await query(`
        INSERT INTO stock_history(store_id, product_id, quantity_change, change_date, change_type)
        VALUES(
          ${db.escape(storeId)},
          ${db.escape(order.product_id)},
          ${db.escape(order.quantity)},
          ${db.escape(orderDate)},
          "deduct"
        )`);

        // const resultAddOrderDetailsQuery = await query(addOrderDetailsQuery);
        // const resultDeleteCartQuery = await query(deleteCartQuery);
        // const resultUpdateInventoryStockQuery = await query(updateInventoryStockQuery);
        // const resultQuantityChangeHistoryQuery = await query(quantityChangeHistoryQuery);
      });

      res.status(200).send({
        message: "Order recorded, please proceed to payment. Thank you!",
        order: addOrderQuery,
      });
    } catch (error) {
      next(error);
    }
  },
  uploadPaymentProof: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      handleValidationErrors(errors);
      const orderId = req.query.orderId;

      let payment_proof = "";

      if (req.file) {
        payment_proof = "uploads/" + req.file.filename;
      } else {
        throw {
          status_code: 400,
          message: "No file uploaded.",
          errors: errors.array(),
        };
      }

      const uploadProofQuery = await query(
        `UPDATE orders
        SET
          payment_proof = ${db.escape(payment_proof)},
          order_status = "To be delivered"
        WHERE
          order_id = ${db.escape(orderId)}`
      );

      res.status(200).json({
        message: "Payment proof uploaded",
        data: uploadProofQuery,
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  cancelOrder: async (req, res, next) => {
    try {
      const orderId = req.query.orderId;

      //1. cari di table order_details, order dengan order id yg dipilih
      const orderDetails = await query(
        `SELECT * FROM order_details
          WHERE order_id = ${db.escape(orderId)}`
      );

      orderDetails.forEach(async (order) => {
        console.log(order.product_id);
        console.log(order.quantity);

        // 2. Update stock di table store_inventory
        const updateInventoryStockQuery = await query(
          `UPDATE store_inventory
          SET
            quantity_in_stock = quantity_in_stock + ${db.escape(order.quantity)}
          WHERE product_id = ${db.escape(order.product_id)}`
        );

        // 3. record perubahan stock di history
        const quantityChangeHistoryQuery = await query(`
        INSERT INTO stock_history(store_id, product_id, quantity_change, change_date, change_type)
          SELECT
            orders.store_id,
            ${db.escape(order.product_id)}, 
            ${db.escape(order.quantity)},
            orders.order_date,
            "add"
          FROM orders
          WHERE order_id = ${db.escape(orderId)}`);
      });

      // 4. ubah status order menjadi "canceled" di table orders
      const cancelOrderQuery = await query(
        `UPDATE orders
        SET
          order_status = "Canceled"
        WHERE
          order_id = ${db.escape(orderId)}`
      );

      res.status(200).send({
        message: `Order #${orderId} canceled.`,
        data: cancelOrderQuery,
      });
    } catch (error) {
      next(error);
    }
  },
};
