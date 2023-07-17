const { db, query } = require("../config/db");

module.exports = {
  getVoucher: async (req, res, next) => {
    try {
      let storeId = req.query.storeId;

      const voucherQuery = await query(`
          SELECT *
          FROM vouchers
          WHERE store_id = ${db.escape(storeId)}
      `);

      return res.status(200).send(voucherQuery);
      // return res.status(200).send("get vouchers");
    } catch (error) {
      next(error);
    }
  },
  getCart: async (req, res, next) => {
    try {
      let userId = req.query.userId;
      let storeId = req.query.storeId;

      // check discount
      const cartQuery = await query(`
              SELECT
              c.cart_id,
              c.store_inventory_id,
              p.product_id,
              p.product_name,
              p.product_price,
              d.discount_value,
              CASE
                  WHEN d.discount_value IS NULL THEN p.product_price
                  WHEN d.discount_value_type = 'NOMINAL' THEN p.product_price - d.discount_value
                  WHEN d.discount_value_type = 'PERCENTAGE' THEN p.product_price - (p.product_price * d.discount_value/100)
              END AS discounted_price,
              p.product_weight * c.quantity AS weight,
              CASE
                  WHEN d.discount_type = 'BUY_1_GET_1' THEN c.quantity * 2
                  ELSE c.quantity
              END AS quantity,   
              si.quantity_in_stock,
              CASE
                  WHEN d.discount_value IS NULL THEN p.product_price * c.quantity
                  WHEN d.discount_value_type = 'NOMINAL' THEN (p.product_price - d.discount_value) * c.quantity
                  WHEN d.discount_value_type = 'PERCENTAGE' THEN (p.product_price - (p.product_price * d.discount_value/100)) * c.quantity
              END AS subtotal,
              CASE
                  WHEN d.discount_type = 'BUY_1_GET_1' THEN TRUE
                  ELSE FALSE
              END AS buy1get1
              FROM
              cart c
              INNER JOIN store_inventory si ON c.store_inventory_id = si.store_inventory_id AND si.store_id = ${db.escape(storeId)}
              INNER JOIN products p ON si.product_id = p.product_id
              LEFT JOIN product_discounts pd ON c.store_inventory_id = pd.store_inventory_id
              LEFT JOIN discounts d ON pd.discount_id = d.discount_id
              WHERE
              c.user_id = ${db.escape(userId)};
            `);

      // const cartQuery = `
      // SELECT c.cart_id, si.product_id, p.product_name, p.product_price, (p.product_weight * c.quantity) AS weight, c.quantity, si.quantity_in_stock, (p.product_price * c.quantity) AS subtotal
      // FROM cart c
      // JOIN store_inventory si ON c.store_inventory_id = si.store_inventory_id
      // JOIN products p ON si.product_id = p.product_id
      // WHERE c.user_id = ${db.escape(userId)};
      // `;

      return res.status(200).send(
        // storeId
        {
          message: "Cart fecthed succesfully",
          cart: cartQuery,
        }
      );
    } catch (error) {
      next(error);
    }
  },
  addToCart: async (req, res, next) => {
    let userId = req.body.user_id;
    let productId = req.body.product_id;
    let quantity = req.body.quantity;
    let storeId = req.body.store_id;

    try {
      const checkCartExistQuery = `
      SELECT quantity
      FROM cart
      WHERE user_id = ${db.escape(userId)} AND store_inventory_id = (
          SELECT store_inventory_id
          FROM store_inventory
          WHERE product_id = ${db.escape(productId)} AND
          store_id = ${db.escape(storeId)}
      )
      `;

      let cartExist = await query(checkCartExistQuery);

      if (cartExist.length > 0) {
        //
        const checkInventoryStockQuery = `
        SELECT quantity_in_stock
        FROM store_inventory
        WHERE product_id = ${db.escape(productId)} AND
        store_id = ${db.escape(storeId)};
        `;

        let resultCheckInventoryStockQuery = await query(checkInventoryStockQuery);

        if (resultCheckInventoryStockQuery[0].quantity_in_stock < quantity + cartExist[0].quantity) {
          throw { status_code: 400, message: "Add to cart fails. Not enough stock." }; // check  jika stock < quantity + jumlah di cart sekarang
        }

        const updateCartQuantityQuery = `
          UPDATE cart
          SET quantity = quantity +  ${db.escape(quantity)}
          WHERE user_id =  ${db.escape(userId)} AND store_inventory_id = (
            SELECT store_inventory_id
            FROM store_inventory
            WHERE product_id =  ${db.escape(productId)} AND
            store_id = ${db.escape(storeId)})
          `;

        let resultUpdateCartQuantityQuery = await query(updateCartQuantityQuery);
        // let updateInventoryStock = await query(updateInventoryStockQuery);

        return res.status(200).send({
          message: "Cart updated",
          data: resultUpdateCartQuantityQuery,
        });
      }

      const addToCartQuery = `
      INSERT INTO cart (user_id, store_inventory_id, quantity)
      SELECT
          ${db.escape(userId)} AS user_id,
          si.store_inventory_id,
          ${db.escape(quantity)} AS quantity
      FROM
          store_inventory si
      JOIN
          products p ON si.product_id = p.product_id
      WHERE
          p.product_id =  ${db.escape(productId)} AND
          si.store_id = ${db.escape(storeId)};
      `;

      let resultAddToCartQuery = await query(addToCartQuery);
      // let updateInventoryStock = await query(updateInventoryStockQuery);

      return res.status(200).send({
        message: "Added to cart",
        data: resultAddToCartQuery,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteFromCart: async (req, res, next) => {
    let cartId = req.body.cart_id;
    let productId = req.body.product_id;
    let quantity = req.body.quantity;

    try {
      const deleteFromCartQuery = `
      DELETE FROM cart
      WHERE cart_id = ${db.escape(cartId)};
      `;

      let resultDeleteFromCartQuery = await query(deleteFromCartQuery);

      return res.status(200).send({
        message: "Cart item deleted",
        data: resultDeleteFromCartQuery,
      });
    } catch {
      next;
    }
  },
  updateCart: async (req, res, next) => {
    let cartId = req.body.cart_id;
    let productId = req.body.product_id;
    let quantity = req.body.quantity;
    let method = req.body.method;

    try {
      if (method == "add") {
        const checkCurrentCartQtyQuery = `
        SELECT quantity
        FROM cart
        WHERE cart_id = ${db.escape(cartId)};
        `;

        const checkInventoryStockQuery = `
        SELECT quantity_in_stock
        FROM store_inventory
        WHERE product_id = ${db.escape(productId)};
        `;

        let resultcheckCurrentCartQtyQuery = await query(checkCurrentCartQtyQuery);
        let resultCheckInventoryStockQuery = await query(checkInventoryStockQuery);

        if (resultCheckInventoryStockQuery[0].quantity_in_stock < quantity + resultcheckCurrentCartQtyQuery[0].quantity) {
          throw { status_code: 400, message: "Update cart fails. Not enough stock." }; // check  jika stock < quantity + jumlah di cart sekarang
        }

        const updateCartQuery = `
        UPDATE cart
        SET quantity = quantity +  ${db.escape(quantity)}
        WHERE cart_id =  ${db.escape(cartId)}`;

        let resultUpdateCartQuery = await query(updateCartQuery);

        return res.status(200).send({
          message: "Adding qty",
          data: resultUpdateCartQuery,
        });
      }

      if (method == "subs") {
        const checkCurrentCartQtyQuery = `
        SELECT quantity
        FROM cart
        WHERE cart_id = ${db.escape(cartId)};
        `;

        let resultcheckCurrentCartQtyQuery = await query(checkCurrentCartQtyQuery);

        if (resultcheckCurrentCartQtyQuery[0].quantity - quantity < 1) {
          throw { status_code: 400, message: "Update cart fails. Minimum quantity is 1." }; // check  jika stock < quantity + jumlah di cart sekarang
        }

        const updateCartQuery = `
        UPDATE cart
        SET quantity = quantity -  ${db.escape(quantity)}
        WHERE cart_id =  ${db.escape(cartId)}`;

        let resultUpdateCartQuery = await query(updateCartQuery);

        return res.status(200).send({
          message: "Substracting qty",
          data: resultUpdateCartQuery,
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
