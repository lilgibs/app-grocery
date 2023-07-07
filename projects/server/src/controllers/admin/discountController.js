const { db, query } = require("../../config/db");
const { validationResult } = require("express-validator");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../utils/errorHandlers");

module.exports = {
  getDiscount: async (req, res, next) => {
    try {
      const { store_id } = req.params;

      const getDiscountQuery = await query(
        `SELECT * FROM discounts WHERE store_id=${db.escape(store_id)}`
      );

      return res.status(200).send({
        data: getDiscountQuery,
        message: "Discounts retrieve successfully!",
      });
    } catch (error) {
      handleServerError(error, next);
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
        discount_additional_info,
        start_date,
        end_date,
      } = req.body;
      const { store_id } = req.params;

      const addDiscountQuery = await query(
        `INSERT INTO discounts VALUES(null, ${db.escape(store_id)}, ${db.escape(
          discount_type
        )}, ${db.escape(discount_value_type)}, ${db.escape(
          discount_value
        )}, ${db.escape(discount_additional_info)}, ${db.escape(
          start_date
        )}, ${db.escape(end_date)})`
      );

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
        discount_additional_info,
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
            discount_additional_info = ${db.escape(discount_additional_info)},
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

      const softDeleteAddressQuery = await query(
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
