const express = require('express')
const { adminProductController, adminProductImageController, adminProductStockController } = require('../../controllers')
const { check } = require('express-validator')
const upload = require('../../middleware/uploadMiddleware')
const { adminVerifyToken } = require('../../middleware/adminAuth')
const router = express.Router()

// Router product CRUD
router.get('/', adminVerifyToken, adminProductController.getProducts)
router.get('/inventory', adminVerifyToken, adminProductController.getStoreProducts)
router.get('/:productId', adminVerifyToken, adminProductController.getProductById)
router.post('/', adminVerifyToken,
  upload.array('product_images', 3),
  check('store_id').notEmpty().withMessage('Store id is required'),
  check('product_name').notEmpty().withMessage('Product name is required'),
  check('quantity_in_stock').notEmpty().withMessage('Product quantity is required').isLength({ max: 250 }).withMessage('Product description can only be a maximum of 250 characters'),
  adminProductController.addProduct)
router.put('/:productId',
  check('product_category_id').notEmpty().withMessage('Product category is required'),
  check('product_name').notEmpty().withMessage('Product name is required'),
  check('product_description').notEmpty().withMessage('Product description is required'),
  check('product_weight').notEmpty().withMessage('Product weight is required'),
  check('product_price').notEmpty().withMessage('Product price is required'),
  adminProductController.updateProduct)
router.delete('/:productId', adminVerifyToken, adminProductController.deleteProduct)
router.delete('/:productId/permanently', adminVerifyToken, adminProductController.hardDeleteProduct)

// Router Product Image
router.post('/image', adminVerifyToken,
  upload.single('product_image'),
  check('product_id').notEmpty().withMessage('Product id is required'),
  adminProductImageController.addProductImage)
router.put('/image/:productImageId', adminVerifyToken,
  upload.single('product_image'),
  check('product_id').notEmpty().withMessage('Product id is required'),
  adminProductImageController.updateProductImage)
router.delete('/image/:productImageId', adminVerifyToken, adminProductImageController.deleteProductImage)
router.delete('/image/:productImageId/permanently', adminVerifyToken, adminProductImageController.hardDeleteProductImage)

// Router Product Stock
router.post('/:productId/increase-stock', adminVerifyToken,
  check('product_stock').isInt({ min: 1 }).withMessage('Product stock quantity is required and must be at least 1'),
  adminProductStockController.increaseStock)
router.post('/:productId/decrease-stock', adminVerifyToken,
  check('product_stock').notEmpty().withMessage('Product stock quantity is required'),
  adminProductStockController.decreaseStock)

module.exports = router