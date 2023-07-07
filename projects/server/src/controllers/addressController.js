const { db, query } = require("../config/db");
const { validationResult } = require("express-validator");
const {
  handleValidationErrors,
  handleServerError,
} = require("../utils/errorHandlers");

module.exports = {
  addAddress: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      handleValidationErrors(errors);
      const { user_id, street, city, province, longitude, latitude } = req.body;
      let city_id = 0;
      let province_id = 0;

      //Check if this is the first inserted address
      const checkExistingAddressQuery = await query(
        `SELECT * FROM addresses WHERE user_id=${db.escape(
          user_id
        )} AND is_deleted=false`
      );

      const getProvinceQuery = await query(
        `SELECT province_id FROM provinces WHERE province_name=${db.escape(
          province
        )}`
      );

      const getCityQuery = await query(
        `SELECT city_id FROM cities WHERE city_name=${db.escape(city)}`
      );

      city_id = getCityQuery[0].city_id;
      province_id = getProvinceQuery[0].province_id;

      const addAddressQuery = await query(
        `INSERT INTO addresses VALUES(null, ${db.escape(user_id)}, ${db.escape(
          province_id
        )}, ${db.escape(city_id)}, ${db.escape(street)}, ${db.escape(
          longitude
        )}, ${db.escape(latitude)}, ${
          checkExistingAddressQuery.length === 0
            ? db.escape(true)
            : db.escape(false)
        }, false)`
      );

      return res.status(201).send({
        data: addAddressQuery,
        message: "Address added successfully!",
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  getAddress: async (req, res, next) => {
    try {
      const { user_id } = req.params;

      const getUserAddressQuery = await query(
        `SELECT addresses.*, provinces.province_name, cities.city_name FROM addresses
        INNER JOIN provinces ON provinces.province_id = addresses.province_id
        INNER JOIN cities ON cities.city_id = addresses.city_id WHERE user_id=${db.escape(
          user_id
        )} AND is_deleted=false`
      );

      return res.status(200).send({
        data: getUserAddressQuery,
        message: "Retrieve User's data successfully!",
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  softDeleteAddress: async (req, res, next) => {
    try {
      const { address_id } = req.params;

      const softDeleteAddressQuery = await query(
        `UPDATE addresses SET is_deleted = true WHERE address_id = ${db.escape(
          address_id
        )}`
      );

      return res.status(200).send({ message: "Address deleted!" });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  editAddress: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      handleValidationErrors(errors);
      const { street, city, province, longitude, latitude } = req.body;
      const { address_id } = req.params;
      let city_id = 0;
      let province_id = 0;

      const getProvinceQuery = await query(
        `SELECT province_id FROM provinces WHERE province_name=${db.escape(
          province
        )}`
      );

      const getCityQuery = await query(
        `SELECT city_id FROM cities WHERE city_name=${db.escape(city)}`
      );

      city_id = getCityQuery[0].city_id;
      province_id = getProvinceQuery[0].province_id;

      const editAddressQuery = await query(
        `UPDATE addresses
        SET
          city_id = ${db.escape(city_id)},
          province_id = ${db.escape(province_id)},
          street = ${db.escape(street)},
          longitude = ${db.escape(longitude)},
          latitude = ${db.escape(latitude)}
        WHERE
          address_id = ${db.escape(address_id)}`
      );

      return res.status(200).send({
        data: editAddressQuery,
        message: "Address edited successfully!",
      });
    } catch (error) {
      handleServerError(error, next);
    }
  },
  setMainAddress: async (req, res, next) => {
    try {
      const { user_id, address_id } = req.params;

      const setAllToDefaultQuery = await query(
        `UPDATE addresses
        SET
          first_address = false
        WHERE
          user_id = ${db.escape(user_id)}`
      );

      const setMainQuery = await query(
        `UPDATE addresses
        SET
          first_address = true
        WHERE
          address_id = ${db.escape(address_id)}`
      );

      return res.status(200).send({ message: "Address set as main." });
    } catch (error) {
      handleServerError(error, next);
    }
  },
};
