const express = require('express');
const { productController } = require('../controllers');
// const { } = require('../../controllers')
const { check } = require('express-validator')
// const { } = require('../../middleware/')
const router = express.Router()

router.get('/', productController.getProducts)
router.get('/:productName',
  check('productName').notEmpty().withMessage('Product name must not be empty'),
  productController.getProductDetail)

module.exports = router;