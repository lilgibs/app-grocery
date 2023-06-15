const express = require('express')
const { adminProductController } = require('../../controllers')
const { check } = require('express-validator')
const upload = require('../../middleware/uploadMiddleware')
const router = express.Router()

router.get('/', adminProductController.getProductByName)
router.post('/add-product',
  upload.array('product_images', 3),adminProductController.addProduct)
router.put('/:productID',
  upload.single('product_category_image'),
  check('product_category_name').notEmpty().withMessage('Category name is required'),
  adminProductController.updateProduct)
router.delete('/:productID', adminProductController.deleteProduct)
router.delete('/:productID/permanently', adminProductController.hardDeleteProduct)

module.exports = router