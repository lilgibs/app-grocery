const express = require("express");
const { storeController } = require("../controllers");

const router = express.Router();

router.get("/stores", storeController.getStores);
module.exports = router;
