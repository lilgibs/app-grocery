const bcrypt = require('bcrypt');
const { db, query } = require("../../config/db");
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const { handleValidationErrors, handleServerError } = require('../../utils/errorHandlers');
const path = require('path');
const fs = require('fs');

module.exports = {
  getCategories: async (req, res, next) => {
    const categoryName = req.query.categoryName
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
      let categoriesQuery = `SELECT * FROM product_categories WHERE (is_deleted = 0 OR is_deleted IS NULL)`;
      let categoriesCountQuery = `SELECT COUNT(*) as total FROM product_categories WHERE (is_deleted = 0 OR is_deleted IS NULL)`

      if (categoryName) {
        categoriesQuery += ` AND product_category_name LIKE ${db.escape('%' + categoryName + '%')}`
        categoriesCountQuery += ` AND product_category_name LIKE ${db.escape('%' + categoryName + '%')}`
      }

      categoriesQuery += ` LIMIT ${limit} OFFSET ${offset}`;

      const [resultCategoriesQuery, resultCategoriesCountQuery] = await Promise.all([
        query(categoriesQuery),
        query(categoriesCountQuery)
      ])

      res.status(200).json({
        message: "Successfully fetched all product categories",
        data: resultCategoriesQuery,
        total: resultCategoriesCountQuery
      });
    } catch (error) {
      handleServerError(error, next);
      console.log(error)
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
        };
      }
      handleValidationErrors(errors);

      let getCategoryNameResult = await query(`
        SELECT product_category_name 
        FROM product_categories 
        WHERE product_category_name = ${db.escape(product_category_name)}
      `)

      if (getCategoryNameResult.length > 0) {
        throw {
          status_code: 409,
          message: "Product category already exists. Please choose a different name.",
        };
      }

      let product_category_image = "";
      if (req.file) {
        product_category_image = 'uploads/' + req.file.filename;
      } else {
        throw {
          status_code: 400,
          message: "No file uploaded.",
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
      const adminRole = req.admin.adminRole;
      if (adminRole !== 99) {
        throw {
          status_code: 403,
          message: "Access denied. You are not authorized to access this route.",
        };
      }

      handleValidationErrors(errors);

      let getCategoryNameResult = await query(`
      SELECT * FROM product_categories 
      WHERE product_category_name = ${db.escape(product_category_name)}
    `)

      if (getCategoryNameResult.length > 0 && getCategoryNameResult[0].product_category_id != categoryId) {
        throw {
          status_code: 409,
          message: "Product category already exists. Please choose a different name.",
        };
      }

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