const { db, query } = require("../../config/db");
const { validationResult } = require("express-validator");
const { handleValidationErrors, handleServerError } = require("../../utils/errorHandlers");
const path = require('path');
const fs = require('fs');
const { handleProductExistence, insertNewProduct, insertImages, insertInventory, getProductImages, countProducts,getProductById, getStoreInventory } = require("../../utils/adminProductUtils");
const { validateAdminRole } = require("../../utils/adminValidationUtils");

module.exports = {
  getProducts: async (req, res, next) => {
    try {
      const sqlQuery = `SELECT * FROM products`
      const result = await query(sqlQuery)

      res.status(200).json({
        message: 'Products fetched successfully',
        products: result
      });
    } catch (error) {
      console.log(error)
      handleServerError(error, next);
    }
  },
  getStoreProducts: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const searchText = req.query.search || '';
      const productCategoryId = req.query.category;
      const sortType = req.query.sortType;
      const sortOrder = req.query.sortOrder;
      const adminStoreId = req.admin.adminStoreId;

      const [{ total }] = await countProducts(adminStoreId, searchText, productCategoryId);
      
      const sorting = {
        price: `p.product_price ${sortOrder}`,
        stock: `si.quantity_in_stock ${sortOrder}`,
        name: `p.product_name ${sortOrder}`
      };

      // Menggabungkan tabel products, store_inventory, dan stores berdasarkan product_id dan store_id
      let sqlQuery = `
        SELECT 
          si.*,
          p.*,
          pc.product_category_name,
          (SELECT image_url FROM product_images WHERE product_id = p.product_id LIMIT 1) as image_url
        FROM products p
        JOIN product_categories pc ON p.product_category_id = pc.product_category_id
        JOIN store_inventory si ON p.product_id = si.product_id
        WHERE (si.is_deleted = 0 OR si.is_deleted IS NULL) AND si.store_id = ${db.escape(adminStoreId)}
      `;
      if (searchText !== '') sqlQuery += ` AND p.product_name LIKE ${db.escape('%' + searchText + '%')}`;
      if (productCategoryId) sqlQuery += ` AND p.product_category_id = ${db.escape(productCategoryId)}`;
      if (sortType && sortOrder) sqlQuery += ` ORDER BY ${sorting[sortType]}`;
      sqlQuery += ` LIMIT ${limit} OFFSET ${offset}`;

      const result = await query(sqlQuery);

      res.status(200).json({
        message: 'Products fetched successfully',
        products: result,
        total: total
      });
    } catch (error) {
      console.log(error)
      handleServerError(error, next);
    }
  },
  getProductById: async (req, res, next) => {
    const { productId } = req.params;
    const storeId = req.admin.adminStoreId

    try {
      const [productResult, storeInventoryResult, imageResult] = await Promise.all([
        getProductById(productId),
        getStoreInventory(productId, storeId),
        getProductImages(productId),
      ]);

      if (productResult.length > 0) {
        const product = {
          ...productResult[0],
          ...storeInventoryResult[0],
          product_images: imageResult,
        };

        res.status(200).json({
          message: 'Product fetched successfully',
          product: product,
        });
      } else {
        res.status(404).json({
          message: 'Product not found',
        });
      }
    } catch (error) {
      console.log(error);
      handleServerError(error, next);
    }
  },
  addProduct: async (req, res, next) => {
    const { store_id, product_category_id, product_name, product_description, product_price, product_weight, quantity_in_stock } = req.body;
    const errors = validationResult(req);

    try {
      handleValidationErrors(errors);

      // Memeriksa gambar
      let product_images = [];
      if (req.files) {
        product_images = req.files.map(file => 'uploads/' + file.filename);
      }

      await query('START TRANSACTION');
      // Memeriksa apakah product sudah ada.
      let productId = await handleProductExistence(store_id, product_name);

      // Jika produk belum ada, insert produk baru
      if (!productId) {
        productId = await insertNewProduct(product_category_id, product_name, product_description, product_price, product_weight)
        await insertImages(productId, product_images);
      }

      // Jika produk ada dan belum ada di store_inventory, insert product ke store_inventory
      await insertInventory(store_id, productId, quantity_in_stock);
      await query('COMMIT');

      res.status(201).json({
        message: "Product successfully added"
      });
    } catch (error) {
      await query('ROLLBACK'); // Rollback transaksi jika terjadi kesalahan
      handleServerError(error, next);
      console.log(error)
    }
  },
  updateProduct: async (req, res, next) => {
    const { product_category_id, product_name, product_description, product_price, product_weight } = req.body;
    const { productId } = req.params;
    const errors = validationResult(req);

    try {
      console.log(`Update product id:${productId} `)
      handleValidationErrors(errors);

      const sqlQuery = `UPDATE products
        SET 
          product_category_id = ${db.escape(product_category_id)},
          product_name = ${db.escape(product_name)},
          product_description = ${db.escape(product_description)},
          product_price = ${db.escape(product_price)},
          product_weight = ${db.escape(product_weight)}
        WHERE 
          product_id = ${db.escape(productId)}
      `;
      const result = await query(sqlQuery);

      res.status(200).json({
        message: "Product updated",
        data: result,
      });
    } catch (error) {
      handleServerError(error, next);
      console.log(error)
    }
  },
  deleteProduct: async (req, res, next) => {
    const { productId } = req.params
    const adminStoreId = req.admin.adminStoreId;

    try {
      //Hapus data dari database (ubah is_deleted = 1)
      const sqlQueryDeleteCategory = `UPDATE store_inventory
        SET is_deleted = 1
        WHERE 
          store_id = ${adminStoreId} AND
          product_id = ${db.escape(productId)}
      `;
      const resultDeleteProduct = await query(sqlQueryDeleteCategory);

      res.status(200).json({
        message: "Product is deleted",
        data: resultDeleteProduct
      });
    } catch (error) {
      console.log(error)
      handleServerError(error, next);
    }
  },
  hardDeleteProduct: async (req, res, next) => {
    const { productId } = req.params
    const adminRole = req.admin.adminRole;

    try {
      validateAdminRole(adminRole);

      //Ambil lokasi file gambar
      const resultGetImages = await getProductImages(productId)
      
      const queryDeleteImage = `DELETE FROM product_images WHERE product_id = ${db.escape(productId)}`
      const sqlQueryDeleteProduct = `DELETE FROM products WHERE product_id = ${db.escape(productId)}`;
      
      await query('START TRANSACTION');
      const resultDeleteImages = await query(queryDeleteImage);
      const resultDeleteProduct = await query(sqlQueryDeleteProduct);
      await query('COMMIT');

      //Hapus file gambar
      if (resultGetImages) {
        for (let product_image of resultGetImages) {
          const absolutePath = path.resolve(__dirname, '..', '..', 'uploads', path.basename(product_image.image_url));
          fs.unlinkSync(absolutePath);
        }
      }

      res.status(200).json({
        message: "Product and its associated image are deleted",
        data: resultDeleteProduct
      });
    } catch (error) {
      await query('ROLLBACK'); // Rollback transaksi jika terjadi kesalahan
      console.log(error)
      handleServerError(error, next);
    }
  },
}