const express = require("express");
const { provinceController } = require("../controllers");

const router = express.Router();

router.get("/", provinceController.getProvinces);

module.exports = router;
