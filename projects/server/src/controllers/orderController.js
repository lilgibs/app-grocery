const { db, query } = require("../config/db");
const { validationResult } = require("express-validator");
const { handleValidationErrors, handleServerError } = require("../utils/errorHandlers");

module.exports = {
  getOrders: async (req, res, next) => {
    try {
      let userId = req.query.userId;

      const orderQuery = `
        SELECT * FROM orders
        WHERE user_id = ${db.escape(userId)}`;

      const resultOrderQuery = await query(orderQuery);

      res.status(200).send(resultOrderQuery);
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
      const addOrderQuery = `
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
          `;

      const resultAddOrderQuery = await query(addOrderQuery);

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
          address_id=${db.escape(addressId)};
          `;

      // console.log(orderDate.substring(0, orderDate.length - 9));
      const orderIds = await query(orderIdQuery);
      const orderId = orderIds[orderIds.length - 1].order_id; // choose the last ID (latest ID)

      // 3. Pindah items dari cart ke order_details

      let orderDetails = req.body.order_details;

      orderDetails.forEach(async (order) => {
        const addOrderDetailsQuery = `
          INSERT INTO order_details(order_id, product_id, quantity, price)
          VALUES(
            ${db.escape(orderId)},
            ${db.escape(order.product_id)},
            ${db.escape(order.quantity)},
            ${db.escape(order.subtotal)}
          )`;

        const deleteCartQuery = `
          DELETE FROM cart WHERE
          cart_id = ${db.escape(order.cart_id)};
          `; // reset cart menjadi = 0

        // 4. update stock product

        const updateInventoryStockQuery = `
          UPDATE store_inventory
          SET quantity_in_stock = quantity_in_stock - ${db.escape(order.quantity)}
          WHERE product_id = ${db.escape(order.product_id)};
          `;

        // 5. record perubahan sotck di history

        const quantityChangeHistoryQuery = `
        INSERT INTO stock_history(store_id, product_id, quantity_change, change_date)
        VALUES(
          ${db.escape(storeId)},
          ${db.escape(order.product_id)},
          ${db.escape(order.quantity)},
          ${db.escape(orderDate)}
        )`;

        const resultAddOrderDetailsQuery = await query(addOrderDetailsQuery);
        const resultDeleteCartQuery = await query(deleteCartQuery);
        const resultUpdateInventoryStockQuery = await query(updateInventoryStockQuery);
        const resultQuantityChangeHistoryQuery = await query(quantityChangeHistoryQuery);
      });

      res.status(200).send({
        message: "Order recorded, please proceed to payment. Thank you!",
        order: resultAddOrderQuery,
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
      // const file = req.file;

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

      // const isProofExistQuery = await query(
      //   `SELECT profile_picture FROM orders
      //   WHERE order_id = ${db.escape(orderId)}`
      // );

      // if (isProofExistQuery.length > 0) {
      //   throw {
      //     status_code: 400,
      //     message: "Payment proof already uploaded",
      //     errors: errors.array(),
      //   };
      // }

      // const currentImagePath = isProofExistQuery[0]?.payment_proof;

      const uploadProofQuery = await query(
        `UPDATE orders
        SET
          payment_proof = ${db.escape(payment_proof)},
          order_status = "To be delivered"
        WHERE
          order_id = ${db.escape(orderId)}`
      );

      // if (req.file && currentImagePath) {
      //   const absolutePath = path.resolve(__dirname, "..", "uploads", path.basename(currentImagePath));
      //   if (fs.existsSync(absolutePath)) {
      //     fs.unlinkSync(absolutePath);
      //   }
      // }

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

      const cancelOrderQuery = await query(
        `UPDATE orders
        SET
          order_status = "Canceled"
        WHERE
          order_id = ${db.escape(orderId)}`
      );

      res.status(200).send({
        message: `Order #${orderId} canceled.`,
        data: orderId,
      });
    } catch (error) {
      next(error);
    }
  },
};
