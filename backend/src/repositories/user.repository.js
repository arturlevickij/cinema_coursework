const { getPool } = require("../config/db");

class UserRepository {

  static async findByEmail(email) {
    const pool = await getPool();
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  static async createUser({ name, email, password_hash, role }) {
    const pool = await getPool();

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, password_hash, role]
    );

    const [rows] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [result.insertId]
    );

    return rows[0];
  }
}

module.exports = UserRepository;
