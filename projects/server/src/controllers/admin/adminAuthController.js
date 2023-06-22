const bcrypt = require("bcrypt");
const { db, query } = require("../../config/db");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

module.exports = {
  adminLogin: async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw {
          status_code: 400,
          message: "Format error at backend",
          errors: errors.array(),
        };
      }

      const { email, password } = req.body;

      const isEmailExist = await query(`SELECT * FROM admins WHERE email=${db.escape(email)}`);

      if (isEmailExist.length == 0) {
        throw {
          status_code: 400,
          message: "You are not registered as an admin",
        };
      }

      let payload = { 
        adminId: isEmailExist[0].admin_id,
        adminRole: isEmailExist[0].role,
        adminStoreId: isEmailExist[0].store_id 
      };

      const token = jwt.sign(payload, "joe", { expiresIn: "1h" });

      return res.status(200).send({
        message: "Admin login success",
        token,
        data: {
          id: isEmailExist[0].admin_id,
          name: isEmailExist[0].name,
          email: isEmailExist[0].email,
          name: isEmailExist[0].name,
          role: isEmailExist[0].role,
          store_id: isEmailExist[0].store_id,
          is_deleted: isEmailExist[0].is_deleted,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  checkAdminLogin: async (req, res, next) => {
    try {
      const admin = await query(`SELECT * FROM admins WHERE admin_id = ${db.escape(req.user.adminId)}`);
      if (admin[0].role == 99) {
        return res.status(200).send({
          message: "Super admin verified",
          data: {
            id: admin[0].admin_id,
            name: admin[0].name,
            email: admin[0].email,
            name: admin[0].name,
            role: admin[0].role,
            store_id: admin[0].store_id,
            is_deleted: admin[0].is_deleted,
          },
        });
      }
      return res.status(200).send({
        message: "Branch admin verified",
        data: {
          id: admin[0].admin_id,
          name: admin[0].name,
          email: admin[0].email,
          name: admin[0].name,
          role: admin[0].role,
          store_id: admin[0].store_id,
          is_deleted: admin[0].is_deleted,
        },
      });

      // console.log(req.user.adminId); // checker
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  createBranchAdmin: async (req, res, next) => {
    const { name, email, password, role, store_name, store_location, longitude, latitude } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const adminRole = req.admin.adminRole;
      if (adminRole !== 99) {
        throw {
          status_code: 403,
          message: "Access denied. You are not authorized to access this route.",
          errors: errors.array(),
        };
      }

      const isEmailExist = await query(`select * from admins where email = ${db.escape(email)}`);

      if (isEmailExist.length > 0) {
        next({ status_code: 409, message: "Email has been used" });
      }

      const sqlQueryStore = `INSERT INTO Stores (store_name, store_location, latitude, longitude)
        VALUES(
          ${db.escape(store_name)}, 
          ${db.escape(store_location)}, 
          ${db.escape(latitude)}, 
          ${db.escape(longitude)}
        )`;
      const storeResult = await query(sqlQueryStore);
      const store_id = storeResult.insertId;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const sqlQueryAdmin = `INSERT INTO Admins (name, email, password, role, store_id) 
        VALUES (
          ${db.escape(name)}, 
          ${db.escape(email)}, 
          ${db.escape(hashedPassword)}, 
          ${db.escape(role)}, 
          ${db.escape(store_id)}
        )`;

      const result = await query(sqlQueryAdmin);
      res.status(201).json({
        message: "Branch admin created",
        data: { id: result.insertId, email, role, store_id, store_name, store_location },
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
