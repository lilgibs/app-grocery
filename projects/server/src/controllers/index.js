const adminAuthController = require("./admin/adminAuthController");
const adminCategoryController = require("./admin/adminCategoryController");
const authController = require("./authController");
const storeController = require("./storeController");
const addressController = require("./addressController");
const cityController = require("./cityController");
const provinceController = require("./provinceController");

module.exports = {
  authController,
  adminAuthController,
  adminCategoryController,
  storeController,
  addressController,
  cityController,
  provinceController,
};
