const { db, query } = require("../../config/db");
const { validationResult } = require("express-validator");
const { handleValidationErrors, handleServerError } = require("../../utils/errorHandlers");
const path = require('path');
const fs = require('fs');

const productImageController = {
  addProductImage: async (req, res, next) => {
    const { product_id } = req.body;
    const errors = validationResult(req);

    try {
      handleValidationErrors(errors);

      let newImagePath = '';
      if (req.file) { newImagePath = 'uploads/' + req.file.filename }

      // Mulai transaksi
      await query('START TRANSACTION');

      // Menginput gambar baru ke DB
      const sqlQueryProductImage = `INSERT INTO product_images(product_id, image_url)
          VALUES(
            ${db.escape(product_id)},
            ${db.escape(newImagePath)}
          )`;
      const resultProductImage = await query(sqlQueryProductImage)

      // Commit transaksi jika semua operasi berhasil
      await query('COMMIT');

      res.status(201).json({
        message: "Image added successfully",
      });
    } catch (error) {
      // Rollback transaksi jika terjadi kesalahan
      await query('ROLLBACK');
      handleServerError(error, next);
      console.log(error)
    }
  },

  // Read (Get images by product ID)
  getProductImages: async (req, res) => {
    const { product_id } = req.params;

    try {
      const sqlQuery = `SELECT * FROM product_images WHERE product_id = ${db.escape(product_id)}`;
      const images = await query(sqlQuery);

      res.status(200).json({
        message: 'Images fetched successfully',
        images
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  },

  // Update
  updateProductImage: async (req, res, next) => {
    const { productImageId } = req.params
    const errors = validationResult(req);

    try {
      handleValidationErrors(errors);

      //Ambil lokasi file gambar
      const sqlQueryGetImage = `SELECT image_url FROM product_images WHERE product_image_id = ${db.escape(productImageId)}`
      const resultGetImage = await query(sqlQueryGetImage)
      const currentImagePath = resultGetImage[0]?.image_url

      //File gambar baru
      let newImagePath = currentImagePath
      if (req.file) { newImagePath = 'uploads/' + req.file.filename }

      const sqlQuery = `
        UPDATE product_images
        SET 
          image_url = ${db.escape(newImagePath)}
        WHERE 
          product_image_id = ${db.escape(productImageId)}
      `;
      const result = await query(sqlQuery);

      if (req.file && currentImagePath) {
        const absolutePath = path.resolve(__dirname, '..', '..', 'uploads', path.basename(currentImagePath))
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath)
        }
      }

      res.status(200).json({
        message: "Product image updated",
        data: result
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  deleteProductImage: async (req, res, next) => {
    const { productImageId } = req.params;
    try {
      console.log('product image:' + productImageId)
      const sqlQuery = `UPDATE product_images SET is_deleted = 1 WHERE product_image_id = ${db.escape(productImageId)}`;
      const result = await query(sqlQuery);

      res.status(200).json({
        message: 'Image deleted successfully',
        result
      });
    } catch (error) {
      handleServerError(error, next);
      console.log(error)
    }
  },
  hardDeleteProductImage: async (req, res, next) => {
    const { productImageId } = req.params;
    const productId = req.query.productId

    try {
      // Check authorisasi
      const adminRole = req.admin.adminRole;
      if (adminRole !== 99) {
        throw {
          status_code: 403,
          message: "Access denied. You are not authorized to access this route.",
          errors: errors.array(),
        };
      }

      // Check jumlah gambar
      const sqlQueryImageCount = `SELECT COUNT(*) as imageCount FROM product_images WHERE product_id = ${db.escape(productId)}`;
      const resultImageCount = await query(sqlQueryImageCount);
      if (resultImageCount[0].imageCount <= 1) {
        return res.status(400).json({
          message: 'Cannot delete image. Product must have at least one image.'
        });
      }

      //Ambil lokasi file gambar
      const sqlQueryGetImage = `SELECT image_url FROM product_images WHERE product_image_id = ${db.escape(productImageId)}`
      const resultGetImage = await query(sqlQueryGetImage)
      const currentImagePath = resultGetImage[0]?.image_url

      const sqlQuery = `DELETE FROM product_images WHERE product_image_id = ${db.escape(productImageId)}`;
      const result = await query(sqlQuery);

      if (currentImagePath) {
        const absolutePath = path.resolve(__dirname, '..', '..', 'uploads', path.basename(currentImagePath))
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath)
        }
      }

      res.status(200).json({
        message: 'Image deleted successfully',
        result
      });
    } catch (error) {
      handleServerError(error, next);
    }
  }
};

module.exports = productImageController;
