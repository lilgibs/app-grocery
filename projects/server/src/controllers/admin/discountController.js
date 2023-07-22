const { db, query } = require("../../config/db");
const { validationResult } = require("express-validator");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../utils/errorHandlers");

module.exports = {
  getDiscounts: async (req, res, next) => {
    try {
      const today = new Date();
      const currentDate = today.toISOString().slice(0, 10);
      const { store_id } = req.params;

      const getDiscountsQuery = await query(
        `SELECT d.*, p.product_name FROM product_discounts pd
        INNER JOIN store_inventory si ON pd.store_inventory_id = si.store_inventory_id
        INNER JOIN discounts d ON pd.discount_id = d.discount_id
        INNER JOIN products p ON si.product_id = p.product_id
        WHERE d.end_date >= ${db.escape(
          currentDate
        )} AND d.is_deleted = ${db.escape(false)} AND si.store_id = ${db.escape(
          store_id
        )};`
      );

      return res.status(200).send({
        data: getDiscountsQuery,
        message: "Discounts retrieve successfully!",
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  addDiscount: async (req, res, next) => {
    try {
      const today = new Date();
      const currentDate = today.toISOString().slice(0, 10);

      const errors = validationResult(req);
      handleValidationErrors(errors);

      const {
        discount_type,
        discount_value_type,
        discount_value,
        start_date,
        end_date,
        store_id,
        products,
      } = req.body;

      await query("START TRANSACTION");

      const addDiscountQuery = await query(
        `INSERT INTO discounts VALUES(null, ${db.escape(store_id)}, ${db.escape(
          discount_type
        )}, ${db.escape(discount_value_type)}, ${db.escape(
          discount_value
        )}, ${db.escape(start_date)}, ${db.escape(end_date)}, false)`
      );

      for (const product of products) {
        try {
          const getProductQuery = await query(
            `SELECT si.store_inventory_id, p.product_price from store_inventory si
              inner join products p on si.product_id = p.product_id
              where p.product_name = ${db.escape(
                product
              )} AND si.store_id = ${db.escape(store_id)}`
          );

          const getProductDiscountQuery = await query(
            `SELECT * FROM product_discounts pd
            INNER JOIN store_inventory si ON pd.store_inventory_id = si.store_inventory_id
            INNER JOIN discounts d ON pd.discount_id = d.discount_id
            WHERE pd.store_inventory_id = ${db.escape(
              getProductQuery[0].store_inventory_id
            )} AND d.end_date >= ${db.escape(
              currentDate
            )} AND d.is_deleted = ${db.escape(false)};`
          );

          if (getProductDiscountQuery.length > 0) {
            throw {
              status_code: 400,
              message: "Product already has a promo",
            };
          }

          if (
            discount_value_type === "NOMINAL" &&
            getProductQuery[0].product_price < discount_value
          ) {
            throw {
              status_code: 400,
              message: "Discount value cannot be higher than product price",
            };
          }

          await query(
            `INSERT INTO product_discounts VALUES(null, ${db.escape(
              getProductQuery[0].store_inventory_id
            )}, ${db.escape(addDiscountQuery.insertId)})`
          );
        } catch (error) {
          // Rollback the transaction if there is an error
          await query("ROLLBACK");
          throw error; // Re-throw the error to be caught in the outer catch block
        }
      }

      await query("COMMIT");

      return res.status(201).send({
        data: addDiscountQuery,
        message: "Discount added successfully!",
      });
    } catch (error) {
      await query("ROLLBACK");
      handleServerError(error, next);
    }
  },
  editDiscount: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      handleValidationErrors(errors);

      const {
        discount_type,
        discount_value_type,
        discount_value,
        start_date,
        end_date,
      } = req.body;
      const { discount_id } = req.params;

      const editDiscountQuery = await query(
        `UPDATE discounts
        SET
            discount_type = ${db.escape(discount_type)},
            discount_value_type = ${db.escape(discount_value_type)},
            discount_value = ${db.escape(discount_value)},
            start_date = ${db.escape(start_date)},
            end_date = ${db.escape(end_date)}
        WHERE
            discount_id = ${db.escape(discount_id)}`
      );

      return res.status(200).send({
        data: editDiscountQuery,
        message: "Discount edited successfully!",
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  softDeleteDiscount: async (req, res, next) => {
    try {
      const { discount_id } = req.params;

      await query("START TRANSACTION");

      const softDeleteDiscountQuery = await query(
        `UPDATE discounts SET is_deleted = true WHERE discount_id = ${db.escape(
          discount_id
        )}`
      );

      const deleteProductDiscountRow = await query(
        `DELETE FROM product_discounts 
          WHERE 
          discount_id = ${db.escape(discount_id)}`
      );

      await query("COMMIT");

      return res.status(200).send({ message: "Discount deleted!" });
    } catch (error) {
      await query("ROLLBACK");
      handleServerError(error, next);
    }
  },
};
