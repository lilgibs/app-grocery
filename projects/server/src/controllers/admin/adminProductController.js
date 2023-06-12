const { db, query } = require("../../config/db");
const { validationResult } = require("express-validator");
const { handleValidationErrors } = require("../../utils/errorHandlers");
const path = require('path');
const fs = require('fs');

module.exports = {
  getProduct: async (req, res, next) => {
    try {

    }
    catch {

    }
  },
  getProductByName: async (req, res, next) => {
    try {
      // const productName = req.query.name;
      // if (!productName) {
      //   return res.status(400).json({ error: 'Product name is required' })
      // }

      // const sqlQuery = `SELECT * FROM products 
      //   WHERE product_name LIKE ${db.escape('%' + productName + '%')}`

      const sqlQuery = `SELECT * FROM products`
      const result = await query(sqlQuery)

      res.status(200).json({
        message: 'Products fetched successfully',
        products: result
      });
    } catch (error) {
      console.log(error)
    }
  },
  addProduct: async (req, res, next) => {
    const { store_id, product_category_id, product_name, product_description, product_price, quantity_in_stock } = req.body;
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

      // Jika produk sudah ada, langsung tambahkan data ke store_inventory
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
          product_price
        ) 
        VALUES (
          ${db.escape(product_category_id)},
          ${db.escape(product_name)},
          ${db.escape(product_description)},
          ${db.escape(product_price)}
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
    const { product_category_name } = req.body
    const { categoryId } = req.params
    const errors = validationResult(req);

    try {
      handleValidationErrors(errors);

      //Ambil lokasi file gambar
      const sqlQueryGetImage = `
        SELECT product_category_image FROM product_categories
        WHERE
          product_category_id = ${db.escape(categoryId)}
      `
      const resultGetImage = await query(sqlQueryGetImage)
      const currentImagePath = resultGetImage[0]?.product_category_image

      //File gambar baru
      let newImagePath = currentImagePath
      if (req.file) {
        newImagePath = 'uploads/' + req.file.filename;
      }

      const sqlQuery = `
        UPDATE product_categories 
        SET 
          product_category_name = ${db.escape(product_category_name)},
          product_category_image = ${db.escape(newImagePath)}
        WHERE 
          product_category_id = ${db.escape(categoryId)}
      `;
      const result = await query(sqlQuery);

      if (req.file && currentImagePath) {
        const absolutePath = path.resolve(__dirname, '..', '..', 'uploads', path.basename(currentImagePath))
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath)
        }
      }

      res.status(200).json({
        message: "Product category updated",
        data: result
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  deleteProduct: async (req, res, next) => {
    const { categoryId } = req.params

    try {

      //Hapus data dari database (ubah is_deleted = 1)
      const sqlQueryDeleteCategory = `
        UPDATE product_categories
        SET 
          is_deleted = 1
        WHERE 
          product_category_id = ${db.escape(categoryId)}
      `;
      const resultDeleteCategory = await query(sqlQueryDeleteCategory);

      res.status(200).json({
        message: "Product category is deleted",
        data: resultDeleteCategory
      });
    } catch (error) {
      console.log(error)
    }
  },
  hardDeleteProduct: async (req, res, next) => {
    const { categoryId } = req.params

    try {
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
    }
  }
}