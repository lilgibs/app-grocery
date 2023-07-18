const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { salesReportController } = require("../../controllers");
const { adminVerifyToken } = require("../../middleware/adminAuth");

router.get("/", adminVerifyToken, salesReportController.getAllSalesReport);

router.get(
  "/:store_id",
  adminVerifyToken,
  salesReportController.getSalesReportByStoreId
);

router.get(
  "/details/:order_id",
  adminVerifyToken,
  salesReportController.getOrderDetailsByOrderId
);

module.exports = router;
