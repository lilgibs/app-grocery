const express = require("express");
const { adminOrderController } = require("../../controllers");
const upload = require("../../middleware/uploadMiddleware");
const { adminVerifyToken } = require("../../middleware/adminAuth");
const router = express.Router();

router.get("/", adminOrderController.getStoreOrders);
router.get("/getallorders", adminOrderController.getAllOrders);
router.patch("/confirmorder", adminOrderController.confirmOrder);
router.patch("/rejectorder", adminOrderController.rejectOrder);
router.patch("/sendorder", adminOrderController.sendOrder);

module.exports = router;
