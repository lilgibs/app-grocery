const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { discountController } = require("../../controllers");
const { adminVerifyToken } = require("../../middleware/adminAuth");

router.get("/:store_id", adminVerifyToken, discountController.getDiscount);
router.post(
  "/:store_id",
  adminVerifyToken,
  [
    check("discount_type")
      .notEmpty()
      .withMessage("discount_type cannot be empty"),
    check("discount_value_type")
      .notEmpty()
      .withMessage("discount_value_type cannot be empty"),
    check("discount_value")
      .notEmpty()
      .withMessage("discount_value cannot be empty")
      .isNumeric()
      .withMessage("discount_value must be a number"),
    check("discount_additional_info")
      .notEmpty()
      .withMessage("discount_additional_info cannot be empty")
      .isNumeric()
      .withMessage("discount_additional_info must be a number"),
    check("start_date")
      .notEmpty()
      .withMessage("start_date cannot be empty")
      .isDate()
      .withMessage("discount_additional_info must be a date"),
    check("end_date")
      .notEmpty()
      .withMessage("end_date cannot be empty")
      .isDate()
      .withMessage("discount_additional_info must be a date"),
  ],
  discountController.addDiscount
);
router.put(
  "/:discount_id",
  adminVerifyToken,
  [
    check("discount_type")
      .notEmpty()
      .withMessage("discount_type cannot be empty"),
    check("discount_value_type")
      .notEmpty()
      .withMessage("discount_value_type cannot be empty"),
    check("discount_value")
      .notEmpty()
      .withMessage("discount_value cannot be empty")
      .isNumeric()
      .withMessage("discount_value must be a number"),
    check("discount_additional_info")
      .notEmpty()
      .withMessage("discount_additional_info cannot be empty")
      .isNumeric()
      .withMessage("discount_additional_info must be a number"),
    check("start_date")
      .notEmpty()
      .withMessage("start_date cannot be empty")
      .isDate()
      .withMessage("discount_additional_info must be a date"),
    check("end_date")
      .notEmpty()
      .withMessage("end_date cannot be empty")
      .isDate()
      .withMessage("discount_additional_info must be a date"),
  ],
  discountController.editDiscount
);
router.delete(
  "/:discount_id",
  adminVerifyToken,
  discountController.softDeleteDiscount
);

module.exports = router;
