const express = require("express");
const { orderController, profileController } = require("../controllers");
const upload = require("../middleware/uploadMiddleware");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.get("/", orderController.getOrders);
router.post("/addorder", orderController.addOrder);
router.put("/cancelorder", orderController.cancelOrder);
router.put("/upload-payment-proof", upload.single("payment_proof"), orderController.uploadPaymentProof);
// router.put("/upload-payment-proof", orderController.uploadPaymentProof);

module.exports = router;
