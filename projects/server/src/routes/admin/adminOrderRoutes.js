const express = require("express");
const { adminOrderController, adminOrderFilterController } = require("../../controllers");
const upload = require("../../middleware/uploadMiddleware");
const { adminVerifyToken } = require("../../middleware/adminAuth");
const router = express.Router();

router.get("/", adminOrderController.getStoreOrders);
router.get("/all", adminOrderController.getAllOrders);
router.patch("/confirm-payment", adminOrderController.confirmOrder);
router.patch("/reject-payment", adminOrderController.rejectOrder);
router.patch("/send", adminOrderController.sendOrder);
router.get("/by-status", adminOrderFilterController.getStoreOrdersByStatus);
router.get("/by-invoice", adminOrderFilterController.getStoreOrdersByInvoice);
router.get("/by-date", adminOrderFilterController.getOrdersByDate);

module.exports = router;
