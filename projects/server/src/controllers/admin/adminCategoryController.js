const bcrypt = require('bcrypt');
const { db, query } = require("../../config/db");
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const { handleValidationErrors, handleServerError } = require('../../utils/errorHandlers');

module.exports = {
  getCategory: async (req, res, next) => {
    try {

    } catch (error) {

    }
  },
  createCategory: async (req, res, next) => {
    const { product_category_name } = req.body
    const errors = validationResult(req);

    try {
      handleValidationErrors(errors);

      const sqlQuery = `INSERT INTO product_categories (product_category_name) 
        VALUES (
          ${db.escape(product_category_name)}
        )`;
      const result = await query(sqlQuery)

      res.status(201).json({
        message: "Product category created",
        data: result
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  updateCategory: async (req, res, next) => {
    const { product_category_name } = req.body
    const { categoryId } = req.params
    const errors = validationResult(req);

    try {
      handleValidationErrors(errors);

      const sqlQuery = `UPDATE product_categories 
        SET 
          product_category_name = ${db.escape(product_category_name)} 
        WHERE 
          product_category_id = ${db.escape(categoryId)}
      `;
      const result = await query(sqlQuery);

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
      const sqlQuery = `DELETE FROM product_categories 
        WHERE 
          product_category_id = ${db.escape(categoryId)}
      `;
      const result = await query(sqlQuery);

      res.status(200).json({
        message: "Product category deleted",
        data: result
      });
    } catch (error) {
      next({
        status_code: 500,
        message: "Server error!",
      });
    }
  }
}