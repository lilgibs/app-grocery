const { db, query } = require("../../config/db");
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const { handleValidationErrors, handleServerError } = require('../../utils/errorHandlers');
const { validateAdminRole } = require("../../utils/adminValidationUtils");

module.exports = {
  getDailySales: async (req, res, next) => {
    const { storeId, startOfWeek, endOfWeek } = req.query;
    const { adminRole, adminStoreId } = req.admin

    try {
      let salesDataQuery = `SELECT * FROM orders 
        WHERE 
          order_date BETWEEN ${db.escape(startOfWeek)} AND ${db.escape(endOfWeek)}
          AND order_status = 'completed'
      `
      if (adminRole == 1) {
        salesDataQuery += ` AND store_id = ${db.escape(adminStoreId)}`
      }

      if (storeId) {
        salesDataQuery += ` AND store_id = ${db.escape(storeId)}`
      }

      const salesDataResult = await query(salesDataQuery)

      if (!salesDataResult || !salesDataResult.length) {
        return res.status(200).json({
          data: []
        });
      }

      res.status(200).json({
        data: salesDataResult
      })

    } catch (error) {
      handleServerError(error, next)
    }
  },
  getMonthlySales: async (req, res, next) => {
    const { adminRole, adminStoreId } = req.admin
    const { storeId, startOfMonth, endOfMonth } = req.query

    try {
      let salesDataQuery = `SELECT * FROM orders 
        WHERE 
          order_date BETWEEN ${db.escape(startOfMonth)} AND ${db.escape(endOfMonth)}
          AND order_status = 'completed'
      `
      if (adminRole == 1) {
        salesDataQuery += ` AND store_id = ${db.escape(adminStoreId)}`
      }

      if (storeId) {
        salesDataQuery += ` AND store_id = ${db.escape(storeId)}`
      }

      const salesDataResult = await query(salesDataQuery)

      if (!salesDataResult || !salesDataResult.length) {
        return res.status(200).json({
          data: []
        });
      }

      res.status(200).json({
        data: salesDataResult
      })

    } catch (error) {
      handleServerError(error, next)
      console.log(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const userResult = await query(`SELECT * FROM users`)
      const userCountResult = await query(`SELECT COUNT(*) as total FROM users`)

      res.status(200).json({
        data: userResult,
        total: userCountResult[0].total
      })
    } catch (error) {
      handleServerError(error, next)
    }
  },
  getBranchStores: async (req, res, next) => {
    const { adminRole } = req.admin

    try {
      validateAdminRole(adminRole);
      
      const branchStoresResult = await query(`SELECT * FROM stores`)
      const countStoresResult = await query(`SELECT COUNT(*) as total FROM stores`)
      const totalStores = countStoresResult[0].total
      res.status(200).json({
        data: branchStoresResult,
        total: totalStores
      })
    } catch (error) {
      handleServerError(error, next)
    }
  },
  getProducts: async (req, res, next) => {
    try {
      const productsResult = await query(`SELECT * FROM products`)
      res.status(200).json({
        data: productsResult,
      })
    } catch (error) {
      handleServerError(error, next)
    }
  },
  getProductsSold: async (req, res, next) => {
    const { adminRole, adminStoreId } = req.admin
    const { storeId, startOfMonth, endOfMonth } = req.query

    try {
      let productsSoldQuery = `SELECT 
        SUM(od.quantity) AS products_sold FROM orders o
        JOIN 
          order_details od ON o.order_id = od.order_id
        WHERE 
          o.order_date BETWEEN ${db.escape(startOfMonth)} AND ${db.escape(endOfMonth)}
          AND order_status = 'completed'
      `
      if (adminRole != 99) {
        productsSoldQuery += ` AND store_id = ${db.escape(adminStoreId)}`
      }

      if (storeId) {
        productsSoldQuery += ` AND store_id = ${db.escape(storeId)}`
      }

      const productsSoldResult = await query(productsSoldQuery)

      console.log(productsSoldResult)

      let productsSold;
      if (!productsSoldResult || !productsSoldResult.length || !productsSoldResult[0].products_sold) {
        productsSold = 0;
      } else {
        productsSold = productsSoldResult[0].products_sold
      }

      res.status(200).json({
        data: productsSold
      })

    } catch (error) {
      console.log(error)
    }
  }
}
