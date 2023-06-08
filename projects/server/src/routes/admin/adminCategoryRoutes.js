const express = require('express')
const { adminCategoryController } = require('../../controllers')
const { check } = require('express-validator')
const router = express.Router()

router.post('/categories',
  check('product_category_name').notEmpty().withMessage('Category name is required'),
  adminCategoryController.createCategory)
router.put('/categories/:categoryId',
  check('product_category_name').notEmpty().withMessage('Category name is required'),
  adminCategoryController.updateCategory)
router.delete('/categories/:categoryId', adminCategoryController.deleteCategory)

module.exports = router