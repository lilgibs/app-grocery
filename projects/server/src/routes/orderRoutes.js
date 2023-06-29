const express = require("express");
const { orderController } = require("../controllers");
const router = express.Router();

router.post("/addorder", orderController.addOrder);

module.exports = router;
