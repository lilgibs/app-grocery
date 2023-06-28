const express = require("express");
const { profileController } = require("../controllers");
const { verifyToken } = require("../middleware/auth");
const { check } = require("express-validator");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.put(
  "/:user_id",
  verifyToken,
  [
    check("name").notEmpty().withMessage("Name cannot be empty"),
    check("email").notEmpty().withMessage("Email cannot be empty"),
    check("gender").notEmpty().withMessage("Gender cannot be empty"),
    check("birthdate").notEmpty().withMessage("Birthdate cannot be empty"),
  ],
  profileController.editProfile
);
router.put(
  "/profile-picture/:user_id",
  verifyToken,
  upload.single("profile_picture"),
  profileController.editPhotoProfile
);

module.exports = router;
