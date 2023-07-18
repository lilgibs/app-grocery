const adminAuthRoutes = require("./admin/adminAuthRoutes");
const adminCategoryRoutes = require("./admin/adminCategoryRoutes");
const adminProductRoutes = require("./admin/adminProductRoutes");
const adminDashboarRoutes = require("./admin/adminDashboardRoutes");
const adminOrderRoutes = require("./admin/adminOrderRoutes");
const authRoutes = require("./authRoutes");
const storeRoutes = require("./storeRoutes");
const addressRoutes = require("./addressRoutes");
const cityRoutes = require("./cityRoutes");
const provinceRoutes = require("./provinceRoutes");
const productRoutes = require("./productRoutes");
const profileRoutes = require("./profileRoutes");
const cartRoutes = require("./cartRoutes");
const orderRoutes = require("./orderRoutes");
const discountRoutes = require("./admin/discountRoutes");
const voucherRoutes = require("./admin/voucherRoutes");
const stockHistoryRoutes = require("./admin/stockHistoryRoutes");
const salesReportRoutes = require("./admin/salesReportRoutes");

module.exports = {
  authRoutes,
  adminAuthRoutes,
  adminCategoryRoutes,
  adminProductRoutes,
  adminDashboarRoutes,
  storeRoutes,
  addressRoutes,
  cityRoutes,
  provinceRoutes,
  productRoutes,
  profileRoutes,
  cartRoutes,
  orderRoutes,
  adminOrderRoutes,
  discountRoutes,
  voucherRoutes,
  stockHistoryRoutes,
  salesReportRoutes,
};
