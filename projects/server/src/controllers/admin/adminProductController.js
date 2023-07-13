const { db, query } = require("../../config/db");
const { validationResult } = require("express-validator");
const { handleValidationErrors, handleServerError } = require("../../utils/errorHandlers");
const path = require('path');
const fs = require('fs');

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
      const sortType = req.query.sortType; // 'price' or 'stock'
      const sortOrder = req.query.sortOrder; // 'asc' or 'desc'
      const adminStoreId = req.admin.adminStoreId;

      // Mendapatkan jumlah produk berdasarkan store_id
      let countSqlQuery = ` SELECT COUNT(*) as total
        FROM products p
        JOIN store_inventory si ON p.product_id = si.product_id
        WHERE (si.is_deleted = 0 OR si.is_deleted IS NULL) AND si.store_id = ${db.escape(adminStoreId)}
      `;
      if (searchText !== '') {
        countSqlQuery += ` AND p.product_name LIKE ${db.escape('%' + searchText + '%')}`;
      }
      if (productCategoryId) {
        countSqlQuery += ` AND p.product_category_id = ${db.escape(productCategoryId)}`;
      }

      const countResult = await query(countSqlQuery, [adminStoreId]);
      const total = countResult[0].total;

      // Menggabungkan tabel products, store_inventory, dan stores berdasarkan product_id dan store_id
      let sqlQuery = `
        SELECT 
          si.store_inventory_id,
          p.product_id,
          pc.product_category_name,
          p.product_name,
          p.product_description,
          p.product_price,
          si.quantity_in_stock,
          (SELECT image_url FROM product_images WHERE product_id = p.product_id LIMIT 1) as image_url
        FROM products p
        JOIN product_categories pc ON p.product_category_id = pc.product_category_id
        JOIN store_inventory si ON p.product_id = si.product_id
        WHERE (si.is_deleted = 0 OR si.is_deleted IS NULL) AND si.store_id = ${db.escape(adminStoreId)}
      `;
      if (searchText !== '') {
        sqlQuery += ` AND p.product_name LIKE ${db.escape('%' + searchText + '%')}`;
      }
      if (productCategoryId) {
        sqlQuery += ` AND p.product_category_id = ${db.escape(productCategoryId)}`;
      }
      if (sortType && sortOrder) {
        sqlQuery += ` ORDER BY ${sortType === 'price' ? 'p.product_price' : 'si.quantity_in_stock'} ${sortOrder}`;
      }
      sqlQuery += ` LIMIT ${limit} OFFSET ${offset}`;

      const result = await query(sqlQuery, [adminStoreId]);

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
      const sqlProductQuery = `SELECT * FROM products WHERE product_id = ${db.escape(productId)}`;
      const productResult = await query(sqlProductQuery);

      const sqlStoreInventory = `SELECT * FROM store_inventory WHERE product_id = ${db.escape(productId)} AND store_id = ${db.escape(storeId)}`;
      const storeInventoryResult = await query(sqlStoreInventory);

      if (productResult.length > 0) {
        const sqlImageQuery = `SELECT * FROM product_images WHERE product_id = ${db.escape(productId)}`;
        const imageResult = await query(sqlImageQuery);

        const product = {
          product_id: productResult[0].product_id,
          product_category_id: productResult[0].product_category_id,
          product_name: productResult[0].product_name,
          product_description: productResult[0].product_description,
          product_price: productResult[0].product_price,
          product_weight: productResult[0].product_weight,
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
        res.status(404).json({
          message: 'Product not found',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  },
  addProduct: async (req, res, next) => {
    const { store_id, product_category_id, product_name, product_description, product_price, product_weight, quantity_in_stock } = req.body;
    const errors = validationResult(req);

    try {
      handleValidationErrors(errors);

      // 1. Memeriksa gambar
      let product_images = [];
      if (req.files) {
        product_images = req.files.map(file => 'uploads/' + file.filename);
      }

      // Mulai transaksi
      await query('START TRANSACTION');

      // Memeriksa apakah product_name sudah tersedia di db
      const checkProductQuery = `SELECT * FROM products WHERE product_name = ${db.escape(product_name)}`
      const existingProduct = await query(checkProductQuery);

      // Jika product sudah ada, check apakah produk yang diinput sudah ada di inventory
      if (existingProduct.length > 0) {
        const checkStoreInventory = `SELECT * FROM store_inventory WHERE store_id = ${db.escape(store_id)} AND product_id = ${db.escape(existingProduct[0].product_id)}`
        const existingStoreInventory = await query(checkStoreInventory);

        // Jika pasangan store_id dan product_id sudah ada, lemparkan error
        if (existingStoreInventory.length > 0) {
          throw {
            status_code: 409,
            message: "Failed to add product. Store already has the chosen product.",
            errors: errors.array(),
          }
        }
      }

      // Jika produk sudah ada dan belum ada di inventory store, langsung tambahkan data ke store_inventory
      if (existingProduct.length > 0) {
        const productId = existingProduct[0].product_id;

        const sqlQueryStoreInventory = `INSERT INTO store_inventory (
          store_id,
          product_id, 
          quantity_in_stock
        ) 
        VALUES (
          ${db.escape(store_id)},
          ${db.escape(productId)},
          ${db.escape(quantity_in_stock)}
        )`;
        const resultStoreInventory = await query(sqlQueryStoreInventory);

        // Commit transaksi jika semua operasi berhasil
        await query('COMMIT');

        return res.status(201).json({
          message: "Product success to add",
          data: resultStoreInventory
        });
      }

      // 2. Meinginput product ke DB (Jika produk belum ada)
      const sqlQueryProduct = `INSERT INTO products (
          product_category_id,
          product_name, 
          product_description,
          product_price,
          product_weight
        ) 
        VALUES (
          ${db.escape(product_category_id)},
          ${db.escape(product_name)},
          ${db.escape(product_description)},
          ${db.escape(product_price)},
          ${db.escape(product_weight)}
        )`;
      const resultProduct = await query(sqlQueryProduct)
      const productId = resultProduct.insertId

      // 3. Menginput gambar ke DB
      for (let product_image of product_images) {
        const sqlQueryProductImage = `INSERT INTO product_images(product_id, image_url)
          VALUES(
            ${db.escape(productId)},
            ${db.escape(product_image)}
          )`;
        const resultProductImage = await query(sqlQueryProductImage)
      }

      // 4. Menginput store inventory (store_id, stock)
      const sqlQueryStoreInventory = `INSERT INTO store_inventory (
        store_id,
        product_id, 
        quantity_in_stock
      ) 
      VALUES (
        ${db.escape(store_id)},
        ${db.escape(productId)},
        ${db.escape(quantity_in_stock)}
      )`;
      const resultStoreInventory = await query(sqlQueryStoreInventory)

      // Commit transaksi jika semua operasi berhasil
      await query('COMMIT');

      res.status(201).json({
        message: "Product success to add",
        data: resultProduct
      });
    } catch (error) {
      // Rollback transaksi jika terjadi kesalahan
      await query('ROLLBACK');
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

      const sqlQuery = `
        UPDATE products
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
      const sqlQueryDeleteCategory = `
        UPDATE store_inventory
        SET 
          is_deleted = 1
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
    const { categoryId } = req.params
    const adminRole = req.admin.adminRole;

    try {
      if (adminRole !== 99) {
        throw {
          status_code: 403,
          message: "Access denied. You are not authorized to access this route.",
        };
      }

      //Ambil lokasi file gambar
      const sqlQueryGetImage = `
        SELECT product_category_image FROM product_categories 
        WHERE 
          product_category_id = ${db.escape(categoryId)}
      `;
      const resultGetImage = await query(sqlQueryGetImage);
      const imagePath = resultGetImage[0]?.product_category_image;
      console.log('img : ', imagePath)

      //Hapus data dari database
      const sqlQueryDeleteCategory = `
        DELETE FROM product_categories 
        WHERE 
          product_category_id = ${db.escape(categoryId)}
      `;
      const resultDeleteCategory = await query(sqlQueryDeleteCategory);

      //Hapus file gambar
      if (imagePath) {
        const absolutePath = path.resolve(__dirname, '..', '..', 'uploads', path.basename(imagePath));
        fs.unlinkSync(absolutePath);
      }

      res.status(200).json({
        message: "Product category and its associated image are deleted",
        data: resultDeleteCategory
      });
    } catch (error) {
      console.log(error)
      handleServerError(error, next);
    }
  },
}