const adminAuthController = require("./admin/adminAuthController");
const adminCategoryController = require("./admin/adminCategoryController");
const authController = require("./authController");
const storeController = require("./storeController");
const addressController = require("./addressController");
const cityController = require("./cityController");
const provinceController = require("./provinceController");
const adminProductController = require('./admin/adminProductController')

module.exports = {
  authController,
  adminAuthController,
  adminCategoryController,
    adminProductController,
  storeController,
  addressController,
  cityController,
  provinceController,
};
