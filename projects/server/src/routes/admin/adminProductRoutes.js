const express = require('express')
const { adminProductController } = require('../../controllers')
const { check } = require('express-validator')
const upload = require('../../middleware/uploadMiddleware')
const { adminVerifyToken } = require('../../middleware/adminAuth')
const router = express.Router()

router.get('/', adminProductController.getProducts)
router.get('/inventory', adminVerifyToken, adminProductController.getStoreProducts)
router.get('/:productId', adminProductController.getProductById)
router.post('/add-product',
  upload.array('product_images', 3),adminProductController.addProduct)
router.put('/:productId',
  upload.single('product_category_image'),
  check('product_category_name').notEmpty().withMessage('Category name is required'),
  adminProductController.updateProduct)
router.delete('/:productId', adminVerifyToken, adminProductController.deleteProduct)
router.delete('/:productId/permanently', adminProductController.hardDeleteProduct)

module.exports = router