const { db, query } = require("../config/db");

module.exports = {
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
          `;

        const resultAddOrderDetailsQuery = await query(addOrderDetailsQuery);
        const resultDeleteCartQuery = await query(deleteCartQuery);
      });

      res.status(200).send({
        message: "Order recorded, please proceed to payment. Thank you!",
        order: resultAddOrderQuery,
      });
    } catch (error) {
      next(error);
    }
  },
};
