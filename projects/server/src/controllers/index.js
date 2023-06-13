const adminAuthController = require("./admin/adminAuthController");
const adminCategoryController = require("./admin/adminCategoryController");
const authController = require("./authController");
const storeController = require("./storeController");
const addressController = require("./addressController");

module.exports = {
  authController,
  adminAuthController,
  adminCategoryController,
  storeController,
  addressController,
};
