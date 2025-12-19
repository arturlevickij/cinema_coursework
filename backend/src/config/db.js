const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectionLimit: 10,
    });
    console.log("MySQL Pool created");
  }
  return pool;
}

module.exports = { getPool };
