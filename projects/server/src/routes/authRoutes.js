const express = require("express");
const { authController, adminAuthController } = require("../controllers");
const { verifyToken } = require("../middleware/auth");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/adminlogin",
  [
    body("email").isEmail().withMessage("Must be a valid e-mail address."),
    body("password")
      .isLength(3)
      .withMessage("Password must be longer than 2 characters."),
  ],
  adminAuthController.adminLogin
);
router.post(
  "/check-adminlogin",
  verifyToken,
  adminAuthController.checkAdminLogin
);

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Must be a valid e-mail address."),
    body("password")
      .isLength(3)
      .withMessage("Password must be longer than 2 characters."),
    body("name").notEmpty().withMessage("Name cannot be empty."),
    body("phone").isNumeric().withMessage("Phone number must be a number."),
  ],
  authController.register
);
router.post("/verification", verifyToken, authController.verification);
router.post("/login", authController.login);
router.post("/check-login", verifyToken, authController.checkLogin);

module.exports = router;
