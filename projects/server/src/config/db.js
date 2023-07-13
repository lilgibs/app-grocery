const mysql = require("mysql2");
const util = require("util");

// const db = mysql.createConnection({
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USERNAME,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
//   port: process.env.DATABASE_PORT,
// });

// local host - TESTING
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
});

db.connect((err) => {
  if (err) {
    return console.error(`error: ${err.message}`);
  }
  console.log("Connected to mysql server");
});

const query = util.promisify(db.query).bind(db);
module.exports = { db, query };
