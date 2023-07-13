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
        `SELECT * FROM discounts WHERE store_id=${db.escape(
          store_id
        )} AND end_date>=${db.escape(currentDate)} AND is_deleted=false`
      );

      return res.status(200).send({
        data: getDiscountsQuery,
        message: "Discounts retrieve successfully!",
      });
    } catch (error) {
      next(error);
    }
  },
  addDiscount: async (req, res, next) => {
    try {
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

      const addDiscountQuery = await query(
        `INSERT INTO discounts VALUES(null, ${db.escape(store_id)}, ${db.escape(
          discount_type
        )}, ${db.escape(discount_value_type)}, ${db.escape(
          discount_value
        )}, ${db.escape(start_date)}, ${db.escape(end_date)}, false)`
      );

      products.forEach(async (product) => {
        const getProductQuery = await query(
          `SELECT si.store_inventory_id, p.product_price from store_inventory si
            inner join products p on si.product_id = p.product_id
            where p.product_name = ${db.escape(
              product
            )} AND si.store_id = ${db.escape(store_id)}`
        );

        const addProductDiscountQuery = await query(
          `INSERT INTO product_discounts VALUES(null, ${db.escape(
            getProductQuery[0].store_inventory_id
          )}, ${db.escape(addDiscountQuery.insertId)})`
        );
      });

      return res.status(201).send({
        data: addDiscountQuery,
        message: "Discount added successfully!",
      });
    } catch (error) {
      next(error);
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
      next(error);
    }
  },
  softDeleteDiscount: async (req, res, next) => {
    try {
      const { discount_id } = req.params;

      const softDeleteDiscountQuery = await query(
        `UPDATE discounts SET is_deleted = true WHERE discount_id = ${db.escape(
          discount_id
        )}`
      );

      return res.status(200).send({ message: "Discount deleted!" });
    } catch (error) {
      handleServerError(error, next);
    }
  },
};
