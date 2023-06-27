const express = require("express");
const { cartController } = require("../controllers");
const { shippingController } = require("../controllers");
const router = express.Router();

router.post("/", cartController.getCart);
router.post("/addtocart", cartController.addToCart);
router.delete("/deletefromcart", cartController.deleteFromCart);
router.post("/getshipping", shippingController.getShipping);
router.post("/updatecart", cartController.updateCart);

module.exports = router;
