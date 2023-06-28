const { validationResult } = require("express-validator");
const { db, query } = require("../config/db");
const { handleServerError, handleValidationErrors } = require("../utils/errorHandlers");

module.exports = {
  getProducts: async (req, res, next) => {
    let storeId = req.query.storeId
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit
    const productCategory = req.query.productCategory
    const sortType = req.query.sortType; // 'price' or 'stock'
    const sortOrder = req.query.sortOrder; // 'asc' or 'desc'

    if (!storeId) {
      const defaultStoreQuery = 'SELECT store_id FROM stores LIMIT 1';
      const resultDefaultStoreQuery = await query(defaultStoreQuery);
      storeId = resultDefaultStoreQuery[0].store_id;
    }

    try {
      let productQuery = `SELECT 
          p.product_id,
          p.product_category_id,
          pc.product_category_name,
          p.product_name,
          p.product_description,
          p.product_price,
          si.store_inventory_id,
          si.quantity_in_stock,
          si.store_id,
          (SELECT image_url FROM product_images WHERE product_id = p.product_id LIMIT 1) as image_url
        FROM products p          
        JOIN store_inventory si on p.product_id = si.product_id
        JOIN product_categories pc ON p.product_category_id = pc.product_category_id
        WHERE si.store_id = ${db.escape(storeId)}`

      let countQuery = `SELECT COUNT(*) as total
        FROM products p
        JOIN store_inventory si on p.product_id = si.product_id
        JOIN product_categories pc ON p.product_category_id = pc.product_category_id
        WHERE si.store_id = ${db.escape(storeId)}`

      if (productCategory) {
        productQuery += ` AND product_category_name LIKE ${db.escape('%' + productCategory + '%')}`
        countQuery += ` AND product_category_name LIKE ${db.escape('%' + productCategory + '%')}`
      }

      if (sortType && sortOrder) {
        productQuery += ` ORDER BY ${sortType === 'price' ? 'p.product_price' : ''} ${sortOrder}`;
      }

      productQuery += ` LIMIT ${limit} OFFSET ${offset}`

      const [resultProductQuery, resultCountQuery] = await Promise.all([
        query(productQuery),
        query(countQuery)
      ])
      const total = resultCountQuery[0].total

      res.status(200).json({
        message: 'Products fetched successfully',
        products: resultProductQuery,
        total: total
      })
    } catch (error) {
      handleServerError(error, next)
      console.log(error)
    }
  },
  getProductDetail: async (req, res, next) => {
    const { productName } = req.params;
    let storeId = req.query.storeId;
    const errors = validationResult(req);

    if (!storeId) {
      const defaultStoreQuery = 'SELECT store_id FROM stores LIMIT 1';
      const resultDefaultStoreQuery = await query(defaultStoreQuery);
      storeId = resultDefaultStoreQuery[0].store_id;
    }

    try {
      handleValidationErrors(errors);

      const sqlProductQuery = `SELECT * FROM products WHERE product_name = ${db.escape(productName)}`;
      const productResult = await query(sqlProductQuery);

      const sqlStoreInventory = `SELECT * FROM store_inventory WHERE product_id = ${db.escape(productResult[0].product_id)} AND store_id = ${db.escape(storeId)}`;
      const storeInventoryResult = await query(sqlStoreInventory);

      if (productResult.length > 0 && storeInventoryResult.length > 0) {
        const sqlImageQuery = `SELECT * FROM product_images WHERE product_id = ${db.escape(productResult[0].product_id)}`;
        const imageResult = await query(sqlImageQuery);

        const product = {
          product_id: productResult[0].product_id,
          product_category_id: productResult[0].product_category_id,
          product_name: productResult[0].product_name,
          product_description: productResult[0].product_description,
          product_price: productResult[0].product_price,
          store_inventory_id: storeInventoryResult[0].store_inventory_id,
          quantity_in_stock: storeInventoryResult[0].quantity_in_stock,
          store_id: storeInventoryResult[0].store_id,
          product_images: imageResult,
        };

        res.status(200).json({
          message: 'Product fetched successfully',
          product: product,
        });
      } else {
        throw {
          status_code: 404,
          message: "We apologize, but the product is not available in your area.",
        }
      }
    } catch (error) {
      console.log(error);
      handleServerError(error, next)
    }
  },
}