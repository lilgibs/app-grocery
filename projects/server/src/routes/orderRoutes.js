const express = require("express");
const { orderController, profileController } = require("../controllers");
const upload = require("../middleware/uploadMiddleware");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.get("/", orderController.getOrders);
router.post("/", orderController.addOrder);
router.patch("/payment-proof", upload.single("payment_proof"), orderController.uploadPaymentProof);
router.patch("/cancel", orderController.cancelOrder);
router.patch("/delivered", orderController.confirmOrderDelivery);

module.exports = router;
