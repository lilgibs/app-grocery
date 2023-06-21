const express = require('express');
const { productController } = require('../controllers');
// const { } = require('../../controllers')
// const { check } = require('express-validator')
// const { } = require('../../middleware/')
const router = express.Router()

router.get('/', productController.getProducts)
router.get('/:productId', productController.getProductById)

module.exports = router;