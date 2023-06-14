const express = require("express");
const { addressController } = require("../controllers");

const router = express.Router();

router.post("/", addressController.addAddress);
router.get("/:user_id", addressController.getAddress);
router.delete("/:address_id", addressController.softDeleteAddress);
router.put("/:address_id", addressController.editAddress);

module.exports = router;
