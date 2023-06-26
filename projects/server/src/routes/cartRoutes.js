const express = require("express");
const { cartController } = require("../controllers");
const router = express.Router();

router.post("/", cartController.getCart);
router.post("/addtocart", cartController.addToCart);

module.exports = router;
