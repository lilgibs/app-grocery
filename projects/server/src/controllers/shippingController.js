const { body } = require("express-validator");
const { db, query } = require("../config/db");
const request = require("request");

module.exports = {
  getShipping: async (req, res, next) => {
    try {
      let store = `%${req.body.origin}%`; // wild card
      const storeToCityId = `
      SELECT
        city_id
      FROM
        cities
      WHERE
        city_name LIKE ${db.escape(store)}
      `;

      let resultStoreToCityId = await query(storeToCityId);

      let cityId = resultStoreToCityId[0].city_id;

      req.body.origin = cityId.toString(); // change city_name to city_id in form

      var options = {
        method: "POST",
        url: "https://api.rajaongkir.com/starter/cost",
        headers: { key: "0f1d6663817ee1cc048278a87e1b29a3", "content-type": "application/x-www-form-urlencoded" },
        form: req.body,
      };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);

        return res.status(200).send(body);
        // console.log(body);
      });
    } catch {
      next;
    }
  },
};
