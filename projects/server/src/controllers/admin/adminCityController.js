const { db, query } = require("../../config/db");

module.exports = {
  getCities: async (req, res, next) => {
    const { city } = req.query;
    
    try {
      getCitiesQuery = await query(`SELECT * FROM cities WHERE city_name LIKE ?`, [`%${city}%`]);
      return res.status(200).send({ data: getCitiesQuery });
    } catch (error) {
      next(error);
      console.log(error)
    }
  },
};
