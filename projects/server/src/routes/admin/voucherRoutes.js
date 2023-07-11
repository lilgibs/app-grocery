const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { voucherController } = require("../../controllers");
const { adminVerifyToken } = require("../../middleware/adminAuth");

router.get("/:store_id", adminVerifyToken, voucherController.getVouchers);
router.post(
  "/",
  adminVerifyToken,
  [
    check("voucher_name")
      .notEmpty()
      .withMessage("voucher_name cannot be empty"),
    check("minimum_amount")
      .notEmpty()
      .withMessage("minimum_amount cannot be empty")
      .isNumeric()
      .withMessage("minimum_amount must be a number"),
    check("discount_value_type")
      .notEmpty()
      .withMessage("discount_value cannot be empty"),
    check("discount_value")
      .notEmpty()
      .withMessage("voucher_value cannot be empty")
      .isNumeric()
      .withMessage("voucher_value must be a number"),
    check("start_date")
      .notEmpty()
      .withMessage("start_date cannot be empty")
      .isDate()
      .withMessage("start_date must be a date"),
    check("end_date")
      .notEmpty()
      .withMessage("end_date cannot be empty")
      .isDate()
      .withMessage("end_date must be a date"),
  ],
  voucherController.addVoucher
);
router.put(
  "/:voucher_id",
  adminVerifyToken,
  [
    check("voucher_name")
      .notEmpty()
      .withMessage("voucher_name cannot be empty"),
    check("minimum_amount")
      .notEmpty()
      .withMessage("minimum_amount cannot be empty")
      .isNumeric()
      .withMessage("minimum_amount must be a number"),
    check("voucher_value_type")
      .notEmpty()
      .withMessage("discount_value cannot be empty"),
    check("voucher_value")
      .notEmpty()
      .withMessage("voucher_value cannot be empty")
      .isNumeric()
      .withMessage("voucher_value must be a number"),
    check("start_date")
      .notEmpty()
      .withMessage("start_date cannot be empty")
      .isDate()
      .withMessage("start_date must be a date"),
    check("end_date")
      .notEmpty()
      .withMessage("end_date cannot be empty")
      .isDate()
      .withMessage("end_date must be a date"),
  ],
  voucherController.editVoucher
);
router.delete(
  "/:voucher_id",
  adminVerifyToken,
  voucherController.softDeleteVoucher
);

module.exports = router;
