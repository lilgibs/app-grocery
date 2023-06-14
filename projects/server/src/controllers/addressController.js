const { db, query } = require("../config/db");

module.exports = {
  addAddress: async (req, res, next) => {
    try {
      const { user_id, street, city, province, longitude, latitude } = req.body;
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

      const addAddressQuery = await query(
        `INSERT INTO addresses VALUES(null, ${db.escape(user_id)}, ${db.escape(
          province_id
        )}, ${db.escape(city_id)}, ${db.escape(street)}, ${db.escape(
          longitude
        )}, ${db.escape(latitude)}, false, false)`
      );

      return res.status(200).send({
        data: addAddressQuery,
        message: "Address added successfully!",
      });
    } catch (error) {
      next(error);
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
      next(error);
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
      next(error);
    }
  },
  editAddress: async (req, res, next) => {
    try {
      const { street, city, province, longitude, latitude } = req.body;
      const { address_id } = req.params;
      let city_id = 0;
      let province_id = 0;

      const isProvinceExist = await query(
        `SELECT province_id FROM provinces WHERE province_name=${db.escape(
          province.toUpperCase()
        )}`
      );

      const isCityExist = await query(
        `SELECT city_id FROM cities WHERE city_name=${db.escape(
          city.toUpperCase()
        )}`
      );

      if (isProvinceExist.length == 0) {
        const addProvinceQuery = await query(
          `INSERT INTO provinces VALUES(null, ${db.escape(
            province.toUpperCase()
          )})`
        );
        province_id = addProvinceQuery.insertId;
      } else {
        province_id = isProvinceExist[0].province_id;
      }

      if (isCityExist.length == 0) {
        const addCityQuery = await query(
          `INSERT INTO cities VALUES(null, ${db.escape(city.toUpperCase())})`
        );
        city_id = addCityQuery.insertId;
      } else {
        city_id = isCityExist[0].city_id;
      }

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
      next(error);
    }
  },
};
