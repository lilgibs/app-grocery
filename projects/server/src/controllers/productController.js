const { validationResult } = require("express-validator");
const { db, query } = require("../config/db");
const { handleServerError, handleValidationErrors } = require("../utils/errorHandlers");

module.exports = {
  getProducts: async (req, res, next) => {
    let storeId = req.query.storeId
    const search = req.query.search
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

    const delExpProductDisc= `DELETE pd FROM product_discounts pd
    join discounts d on pd.discount_id = d.discount_id
    where d.store_id = ${db.escape(storeId)} AND d.end_date < CURDATE()`

    const resultDelExpProductDisc = await query(delExpProductDisc)

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
          d.discount_value,
          d.discount_value_type,
          (SELECT image_url FROM product_images WHERE product_id = p.product_id LIMIT 1) as image_url,
          CASE
            WHEN d.discount_value_type = 'PERCENTAGE' THEN p.product_price * ((100-d.discount_value) / 100)
            WHEN d.discount_value_type = 'NOMINAL' THEN p.product_price - d.discount_value
            ELSE NULL
          END as discounted_price,
          CASE
            WHEN d.discount_type = 'BUY_1_GET_1' THEN 'BUY 1 GET 1'
            ELSE NULL
          END as promo_info
        FROM products p          
        JOIN store_inventory si on p.product_id = si.product_id
        JOIN product_categories pc ON p.product_category_id = pc.product_category_id
        LEFT JOIN product_discounts pd ON si.store_inventory_id = pd.store_inventory_id
        LEFT JOIN discounts d ON pd.discount_id = d.discount_id AND CURDATE() BETWEEN d.start_date AND d.end_date
        WHERE si.store_id = ${db.escape(storeId)} AND (si.is_deleted = 0 OR si.is_deleted IS NULL)`

      let countQuery = `SELECT COUNT(*) as total
        FROM products p
        JOIN store_inventory si on p.product_id = si.product_id
        JOIN product_categories pc ON p.product_category_id = pc.product_category_id
        WHERE si.store_id = ${db.escape(storeId)} AND (si.is_deleted = 0 OR si.is_deleted IS NULL)`

      if (search) {
        productQuery += ` AND product_name LIKE ${db.escape('%' + search + '%')}`
        countQuery += ` AND product_name LIKE ${db.escape('%' + search + '%')}`
      }

      if (productCategory) {
        productQuery += ` AND product_category_name LIKE ${db.escape('%' + productCategory + '%')}`
        countQuery += ` AND product_category_name LIKE ${db.escape('%' + productCategory + '%')}`
      }

      if (sortType && sortOrder) {
        productQuery += ` ORDER BY ${sortType === 'price' ? 'p.product_price' : 'p.product_name'} ${sortOrder}`;
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

      const sqlProductQuery = `
        SELECT 
          p.*,
          si.*,
          d.discount_value,
          d.discount_value_type,
          CASE
            WHEN d.discount_value_type = 'PERCENTAGE' THEN p.product_price * ((100-d.discount_value) / 100)
            WHEN d.discount_value_type = 'NOMINAL' THEN p.product_price - d.discount_value
            ELSE NULL
          END as discounted_price,
          CASE
            WHEN d.discount_type = 'BUY_1_GET_1' THEN 'BUY 1 GET 1'
            ELSE NULL
          END as promo_info
        FROM products p          
        JOIN store_inventory si on p.product_id = si.product_id
        LEFT JOIN product_discounts pd ON si.store_inventory_id = pd.store_inventory_id
        LEFT JOIN discounts d ON pd.discount_id = d.discount_id AND CURDATE() BETWEEN d.start_date AND d.end_date
        WHERE product_name = ${db.escape(productName)} AND si.store_id = ${db.escape(storeId)}`;

      const productResult = await query(sqlProductQuery);

      if (productResult.length > 0) {
        const sqlImageQuery = `SELECT * FROM product_images WHERE product_id = ${db.escape(productResult[0].product_id)}`;
        const imageResult = await query(sqlImageQuery);

        const product = {
          product_id: productResult[0].product_id,
          product_category_id: productResult[0].product_category_id,
          product_name: productResult[0].product_name,
          product_description: productResult[0].product_description,
          product_price: productResult[0].product_price,
          store_inventory_id: productResult[0].store_inventory_id,
          quantity_in_stock: productResult[0].quantity_in_stock,
          store_id: productResult[0].store_id,
          product_images: imageResult,
          discount_value: productResult[0].discount_value,
          discount_value_type: productResult[0].discount_value_type,
          discounted_price: productResult[0].discounted_price,
          promo_info: productResult[0].promo_info,
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