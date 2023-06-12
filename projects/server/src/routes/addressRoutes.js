const express = require("express");
const addressController = require("../controllers/addressController");

const router = express.Router();

router.post("/", addressController.addAddress);
router.get("/:user_id", addressController.getAddress);
router.put("/:address_id", addressController.softDeleteAddress);

module.exports = router;
