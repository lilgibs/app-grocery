const { db, query } = require("../../config/db");
const { validationResult } = require("express-validator");
const { handleValidationErrors, handleServerError } = require("../../utils/errorHandlers");

module.exports = {
  getVouchers: async (req, res, next) => {
    try {
      const today = new Date();
      const currentDate = today.toISOString().slice(0, 10);
      const { store_id } = req.params;
      const getVouchersQuery = await query(`SELECT * FROM vouchers WHERE store_id=${db.escape(store_id)} AND end_date<=${db.escape(currentDate)} AND is_deleted=false`);
      return res.status(200).send({
        data: getVouchersQuery,
        message: "Vouchers retrieve successfully!",
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  addVoucher: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      handleValidationErrors(errors);
      const { voucher_name, minimum_amount, discount_value_type, discount_value, start_date, end_date, store_id } = req.body;
      //   const { store_id } = req.params;
      const addVoucherQuery = await query(
        `INSERT INTO vouchers VALUES(null, ${db.escape(store_id)}, ${db.escape(voucher_name)}, ${db.escape(minimum_amount)}, ${db.escape(discount_value_type)}, ${db.escape(discount_value)}, ${db.escape(start_date)}, ${db.escape(
          end_date
        )}, false)`
      );
      return res.status(201).send({
        data: addVoucherQuery,
        message: "Voucher added successfully!",
      });
    } catch (error) {
      next(error);
    }
  },
  editVoucher: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      handleValidationErrors(errors);
      const { voucher_name, minimum_amount, voucher_value_type, voucher_value, start_date, end_date } = req.body;
      const { voucher_id } = req.params;
      const editVoucherQuery = await query(
        `UPDATE vouchers
        SET
        voucher_name = ${db.escape(voucher_name)},
        minimum_amount = ${db.escape(minimum_amount)},
        voucher_value_type = ${db.escape(voucher_value_type)},
        voucher_value = ${db.escape(voucher_value)},
            start_date = ${db.escape(start_date)},
            end_date = ${db.escape(end_date)}
        WHERE
            voucher_id = ${db.escape(voucher_id)}`
      );
      return res.status(200).send({
        data: editVoucherQuery,
        message: "Voucher edited successfully!",
      });
    } catch (error) {
      next(error);
    }
  },
  softDeleteVoucher: async (req, res, next) => {
    try {
      const { voucher_id } = req.params;
      const softDeleteVoucherQuery = await query(`UPDATE vouchers SET is_deleted = true WHERE voucher_id = ${db.escape(voucher_id)}`);
      return res.status(200).send({ message: "Voucher deleted!" });
    } catch (error) {
      handleServerError(error, next);
    }
  },
};
