const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { stockHistoryController } = require("../../controllers");
const { adminVerifyToken } = require("../../middleware/adminAuth");

router.get(
  "/:store_id",
  adminVerifyToken,
  stockHistoryController.getStockHistory
);

module.exports = router;
