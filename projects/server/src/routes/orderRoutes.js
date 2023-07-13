const express = require("express");
const { orderController, orderFilterController } = require("../controllers");
const upload = require("../middleware/uploadMiddleware");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.get("/", orderController.getOrders);
router.get("/asc", orderFilterController.getOrdersAsc);
router.post("/", orderController.addOrder);
router.patch("/payment-proof", upload.single("payment_proof"), orderController.uploadPaymentProof);
router.patch("/cancel", orderController.cancelOrder);
router.patch("/delivered", orderController.confirmOrderDelivery);
router.get("/by-status", orderFilterController.getOrdersByStatus);
router.get("/by-invoice", orderFilterController.getOrdersByInvoice);
router.get("/by-date", orderFilterController.getOrdersByDate);

module.exports = router;
