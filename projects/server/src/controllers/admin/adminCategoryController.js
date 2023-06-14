const bcrypt = require('bcrypt');
const { db, query } = require("../../config/db");
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const { handleValidationErrors, handleServerError } = require('../../utils/errorHandlers');
const path = require('path');
const fs = require('fs');

module.exports = {
  getCategory: async (req, res, next) => {
    try {
      const sqlQuery = `SELECT * FROM product_categories WHERE is_deleted = 0 OR is_deleted IS NULL`;
      const result = await query(sqlQuery);

      res.status(200).json({
        message: "Successfully fetched all product categories",
        data: result
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  createCategory: async (req, res, next) => {
    const { product_category_name } = req.body;
    const errors = validationResult(req);

    try {
      const adminRole = req.admin.adminRole;
      if (adminRole !== 99) {
        throw {
          status_code: 403,
          message: "Access denied. You are not authorized to access this route.",
          errors: errors.array(),
        };
      }

      handleValidationErrors(errors);

      let product_category_image = "";
      if (req.file) {
        product_category_image = 'uploads/' + req.file.filename;
      } else {
        throw {
          status_code: 400,
          message: "No file uploaded.",
          errors: errors.array(),
        };
      }

      const sqlQuery = `INSERT INTO product_categories (product_category_name, product_category_image) 
        VALUES (
          ${db.escape(product_category_name)},
          ${db.escape(product_category_image)}
        )`;
      const result = await query(sqlQuery)

      res.status(201).json({
        message: "Product category created",
        data: result
      });
    } catch (error) {
      handleServerError(error, next);
      console.log(error)
    }
  },
  updateCategory: async (req, res, next) => {
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
  deleteCategory: async (req, res, next) => {
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
  hardDeleteCategory: async (req, res, next) => {
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