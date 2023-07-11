const express = require("express");
const { authController, adminAuthController } = require("../controllers");
const { verifyToken } = require("../middleware/auth");
const { check } = require("express-validator");

const router = express.Router();

router.post(
  "/adminlogin",
  [
    check("email").isEmail().withMessage("Must be a valid e-mail address."),
    check("password")
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
    check("email").isEmail().withMessage("Must be a valid e-mail address."),
    check("password")
      .isLength(8)
      .withMessage("Password must be at least 8 characters.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one digit")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase character")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase character"),
    check("name").notEmpty().withMessage("Name cannot be empty."),
    check("phone").isNumeric().withMessage("Phone number must be a number."),
  ],
  authController.register
);
router.post("/verification", verifyToken, authController.verification);
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Must be a valid e-mail address."),
    check("password")
      .isLength(3)
      .withMessage("Password must be longer than 2 characters."),
  ],
  authController.login
);
router.post("/check-login", verifyToken, authController.checkLogin);
router.post(
  "/reset-password",
  check("email").isEmail().withMessage("Must be a valid e-mail address."),
  authController.resetPasswordEmail
);
router.put(
  "/change-password/:user_id",
  verifyToken,
  [
    check("oldPassword")
      .isLength(8)
      .withMessage("Password must be at least 8 characters.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one digit")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase character")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase character"),
    check("newPassword")
      .isLength(8)
      .withMessage("Password must be at least 8 characters.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one digit")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase character")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase character"),
  ],
  authController.changePassword
);
router.put(
  "/reset-password",
  verifyToken,
  check("newPassword")
    .isLength(8)
    .withMessage("Password must be at least 8 characters.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one digit")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase character")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase character"),
  authController.resetPassword
);

module.exports = router;
