const { db, query } = require("../config/db");
const { validationResult } = require("express-validator");
const { handleValidationErrors, handleServerError } = require("../utils/errorHandlers");

module.exports = {
  getOrders: async (req, res, next) => {
    try {
      const userId = req.query.userId;
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
        o.user_id = ${db.escape(userId)}`);

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
  getOrderDetails: async (req, res, next) => {
    try {
      const orderId = req.query.orderId;

      const orderQuery = await query(`
      SELECT
        o.*,
        p.product_name
      FROM order_details o
      INNER JOIN products p ON p.product_id = o.product_id
      WHERE
        order_id=${db.escape(orderId)};`);

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
      let address = req.body.address_id;

      //0. mencari address
      const addressQuery = await query(`
          SELECT address_id
          FROM addresses
          WHERE city_id = ${db.escape(address[1])} AND
          street = ${db.escape(address[0])} AND
          is_deleted = 0
          `);

      const addressId = addressQuery[0].address_id;

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

        // 4.5 mencari stock_inventory_id
        const stockInventoryId = await query(`
            SELECT store_inventory_id
            FROM store_inventory
            WHERE
            product_id = ${db.escape(order.product_id)} AND
            store_id = ${db.escape(storeId)}
        `);

        // 5. record perubahan stock di history
        const quantityChangeHistoryQuery = await query(`
        INSERT INTO stock_history(store_inventory_id, quantity_change, change_date, change_type)
        VALUES(
          ${db.escape(stockInventoryId[0].store_inventory_id)},
          ${db.escape(order.quantity)},
          ${db.escape(orderDate)},
          "deduct"
        )`);
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
          order_status = "Waiting for confirmation"
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
  confirmOrderDelivery: async (req, res, next) => {
    try {
      let orderId = req.query.orderId;

      const sendOrderQuery = await query(`
        UPDATE orders
        SET
            order_status = "Delivered"
        WHERE
            order_id = ${db.escape(orderId)}
        `);

      res.status(200).send({
        message: "Order has been delivered",
        data: sendOrderQuery,
      });
    } catch (error) {
      next(error);
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

      const storeId = await query(`
        SELECT store_id FROM orders
        WHERE order_id = ${db.escape(orderId)}
      `);

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

        // 2.5 mencari stock_inventory_id
        const stockInventoryId = await query(`
            SELECT store_inventory_id
            FROM store_inventory
            WHERE
            product_id = ${db.escape(order.product_id)} AND
            store_id = ${db.escape(storeId[0].store_id)}
        `);

        // 3. record perubahan stock di history
        const quantityChangeHistoryQuery = await query(`
        INSERT INTO stock_history(store_inventory_id, quantity_change, change_date, change_type)
          SELECT
            ${db.escape(stockInventoryId[0].store_inventory_id)},
            ${db.escape(order.quantity)},
            orders.order_date,
            "add"
          FROM orders
          WHERE order_id = ${db.escape(orderId)}`);

        console.log(stockInventoryId);
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
  orderReceived: async (req, res, next) => {
    try {
      let orderId = req.query.orderId;

      const orderReceivedQuery = await query(`
        UPDATE orders
        SET
            order_status = "Delivered"
        WHERE
            order_id = ${db.escape(orderId)}
        `);

      res.status(200).send({
        message: "Order delivered",
        data: orderReceivedQuery,
      });
    } catch (error) {
      next(error);
    }
  },
};
