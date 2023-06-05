const bcrypt = require('bcrypt');
const { db, query } = require("../../config/db");

exports.createBranchAdmin = async (req, res) => {
  const { name, email, password, role, store_id } = req.body;

  if (role !== 'branch admin') {
    res.status(400).json({ error: 'Invalid role' });
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sqlQuery = `INSERT INTO Admins (name, email, password, role, store_id) 
      VALUES (
        ${db.escape(name)}, 
        ${db.escape(email)}, 
        ${db.escape(hashedPassword)}, 
        ${db.escape(role)}, 
        ${db.escape(store_id)}
      )`;

    const result = await query(sqlQuery);
    res.status(201).json({ id: result.insertId, email, role, store_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
    // next({
    //   status_code : 500,
    //   message: "Server error"
    // })
  }
};
