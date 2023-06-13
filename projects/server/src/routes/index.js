const adminAuthRoutes = require("./admin/adminAuthRoutes");
const adminCategoryRoutes = require("./admin/adminCategoryRoutes");
const authRoutes = require("./authRoutes");
const storeRoutes = require("./storeRoutes");
const addressRoutes = require("./addressRoutes");

module.exports = {
  authRoutes,
  adminAuthRoutes,
  adminCategoryRoutes,
  storeRoutes,
  addressRoutes,
};
