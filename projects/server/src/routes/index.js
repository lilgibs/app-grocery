const adminAuthRoutes = require("./admin/adminAuthRoutes");
const adminCategoryRoutes = require("./admin/adminCategoryRoutes");
const authRoutes = require("./authRoutes");
const storeRoutes = require("./storeRoutes");
const adminProductRoutes = require('./admin/adminProductRoutes')

module.exports = {
  authRoutes,
  adminAuthRoutes,
  adminCategoryRoutes,
    adminProductRoutes,
  storeRoutes,
};
