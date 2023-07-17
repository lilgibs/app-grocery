const express = require('express')
const { check } = require('express-validator')
const { adminVerifyToken } = require('../../middleware/adminAuth')
const { adminDashboardController } = require('../../controllers')
const router = express.Router()

router.get('/daily-sales', adminVerifyToken, adminDashboardController.getDailySales)
router.get('/monthly-sales', adminVerifyToken, adminDashboardController.getMonthlySales)
router.get('/stores', adminVerifyToken, adminDashboardController.getBranchStores)
router.get('/users', adminVerifyToken, adminDashboardController.getUsers)
router.get('/products', adminVerifyToken, adminDashboardController.getProducts)
router.get('/products-sold', adminVerifyToken, adminDashboardController.getProductsSold)

module.exports = router
