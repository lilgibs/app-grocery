const express = require("express");
const { check } = require("express-validator");
const { addressController } = require("../controllers");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  [
    check("street").notEmpty().withMessage("Street cannot be empty"),
    check("city").notEmpty().withMessage("City cannot be empty"),
    check("province").notEmpty().withMessage("Province cannot be empty"),
  ],
  addressController.addAddress
);
router.get("/:user_id", verifyToken, addressController.getAddress);
router.delete("/:address_id", verifyToken, addressController.softDeleteAddress);
router.put(
  "/:address_id",
  verifyToken,
  [
    check("street").notEmpty().withMessage("Street cannot be empty"),
    check("city").notEmpty().withMessage("City cannot be empty"),
    check("province").notEmpty().withMessage("Province cannot be empty"),
  ],
  addressController.editAddress
);
router.put(
  "/main-address/:user_id/:address_id",
  verifyToken,
  addressController.setMainAddress
);

module.exports = router;
