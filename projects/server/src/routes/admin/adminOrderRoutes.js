const express = require("express");
const { adminOrderController } = require("../../controllers");
const upload = require("../../middleware/uploadMiddleware");
const { adminVerifyToken } = require("../../middleware/adminAuth");
const router = express.Router();

router.get("/", adminOrderController.getStoreOrders);
router.get("/all", adminOrderController.getAllOrders);
router.patch("/confirm-payment", adminOrderController.confirmOrder);
router.patch("/reject-payment", adminOrderController.rejectOrder);
router.patch("/send", adminOrderController.sendOrder);

module.exports = router;
