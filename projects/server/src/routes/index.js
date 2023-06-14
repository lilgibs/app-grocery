const adminAuthRoutes = require("./admin/adminAuthRoutes");
const adminCategoryRoutes = require("./admin/adminCategoryRoutes");
const authRoutes = require("./authRoutes");
const storeRoutes = require("./storeRoutes");
const addressRoutes = require("./addressRoutes");
const cityRoutes = require("./cityRoutes");
const provinceRoutes = require("./provinceRoutes");

module.exports = {
  authRoutes,
  adminAuthRoutes,
  adminCategoryRoutes,
  storeRoutes,
  addressRoutes,
  cityRoutes,
  provinceRoutes,
};
