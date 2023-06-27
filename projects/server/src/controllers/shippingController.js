const axios = require("axios");
const request = require("request");

module.exports = {
  getShipping: async (req, res, next) => {
    try {
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
