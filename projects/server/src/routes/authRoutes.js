const express = require("express");
const { authController } = require("../controllers");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/adminlogin", authController.adminLogin);
router.post("/check-adminlogin", verifyToken, authController.checkAdminLogin);

module.exports = router;
