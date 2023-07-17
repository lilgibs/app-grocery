const express = require("express");
const { cartController } = require("../controllers");
const { shippingController } = require("../controllers");
const router = express.Router();

router.get("/", cartController.getCart);
router.get("/voucher", cartController.getVoucher);
router.post("/", cartController.addToCart);
router.delete("/", cartController.deleteFromCart);
router.patch("/", cartController.updateCart);
router.post("/shipping-fee", shippingController.getShipping);

module.exports = router;
