const { validationResult } = require("express-validator");
const { db, query } = require("../config/db");
const { handleServerError } = require("../utils/errorHandlers");

module.exports = {
  getProducts: async (req, res, next) => {
    let storeId = req.query.storeId

    if (!storeId) {
      const defaultStoreQuery = 'SELECT store_id FROM stores LIMIT 1';
      const resultDefaultStoreQuery = await query(defaultStoreQuery);
      storeId = resultDefaultStoreQuery[0].store_id;
    }

    try {
      const productQuery = `SELECT 
          p.product_id,
          p.product_category_id,
          p.product_name,
          p.product_description,
          p.product_price,
          si.store_inventory_id,
          si.quantity_in_stock,
          si.store_id,
          (SELECT image_url FROM product_images WHERE product_id = p.product_id LIMIT 1) as image_url
        FROM products p          
        JOIN 
          store_inventory si on p.product_id = si.product_id
        WHERE 
          si.store_id = ${db.escape(storeId)}`

      let resultProductQuery = await query(productQuery)
      res.status(200).json({
        message: 'Products fetched successfully',
        products: resultProductQuery
      })
    } catch (error) {
      handleServerError(error, next)
    }
  },
  getProductById: async (req, res, next) => {
    const { productId } = req.params;
    let storeId = req.query.storeId;

    const errors = validationResult(req);

    if (!storeId) {
      const defaultStoreQuery = 'SELECT store_id FROM stores LIMIT 1';
      const resultDefaultStoreQuery = await query(defaultStoreQuery);
      storeId = resultDefaultStoreQuery[0].store_id;
    }

    try {
      console.log(storeId)
      const sqlProductQuery = `SELECT * FROM products WHERE product_id = ${db.escape(productId)}`;
      const productResult = await query(sqlProductQuery);

      const sqlStoreInventory = `SELECT * FROM store_inventory WHERE product_id = ${db.escape(productId)} AND store_id = ${db.escape(storeId)}`;
      const storeInventoryResult = await query(sqlStoreInventory);

      if (productResult.length > 0 && storeInventoryResult.length > 0) {
        const sqlImageQuery = `SELECT * FROM product_images WHERE product_id = ${db.escape(productId)}`;
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