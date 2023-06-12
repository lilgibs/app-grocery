const adminAuthController = require('./admin/adminAuthController')
const adminCategoryController = require('./admin/adminCategoryController')
const authController = require('./authController')
const adminProductController = require('./admin/adminProductController')

module.exports = {
    authController,
    adminAuthController,
    adminCategoryController,
    adminProductController
}