const express = require("express");
const { authController } = require("../controllers");

const router = express.Router();

router.post("/adminlogin", authController.adminLogin);

module.exports = router;
