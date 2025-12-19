// backend/src/repositories/show.repository.js
const { getPool } = require("../config/db");

class ShowRepository {

  static async getAll() {
    const pool = await getPool();
    const [rows] = await pool.query(`
      SELECT s.id, s.title, s.description, s.duration_minutes,
            s.hall_id, s.show_datetime, s.poster_url,
            h.name AS hall_name
      FROM shows s
      LEFT JOIN halls h ON s.hall_id = h.id
      ORDER BY s.show_datetime ASC
    `);
    return rows;
  }

  static async findById(id) {
    const pool = await getPool();
    const [rows] = await pool.query(`
      SELECT s.id, s.title, s.description, s.duration_minutes,
            s.hall_id, s.show_datetime, s.poster_url,
            h.name AS hall_name
      FROM shows s
      LEFT JOIN halls h ON s.hall_id = h.id
      WHERE s.id = ?
    `, [id]);
    return rows[0];
  }

  static async getSeatsForShow(showId) {
    const pool = await getPool();
    const [rows] = await pool.query(`
      SELECT ss.id AS show_seat_id, ss.show_id, ss.seat_id, ss.status,
             st.row_no, st.seat_no, sc.category_name
      FROM show_seats ss
      JOIN seats st ON st.id = ss.seat_id
      JOIN seat_categories sc ON sc.id = st.category_id
      WHERE ss.show_id = ?
      ORDER BY st.row_no, st.seat_no
    `, [showId]);
    return rows;
  }

  static async create(data) {
    const pool = await getPool();
    const [res] = await pool.query(`
      INSERT INTO shows (title, description, duration_minutes, hall_id, show_datetime, poster_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      data.title,
      data.description,
      Number(data.duration_minutes),
      Number(data.hall_id),
      data.show_datetime,
      data.poster_url || null
    ]);
    return res.insertId;
  }

  static async update(id, data) {
    const pool = await getPool();
    await pool.query(`
      UPDATE shows
      SET title=?, description=?, duration_minutes=?, show_datetime=?, poster_url=?
      WHERE id=?
    `, [
      data.title,
      data.description,
      Number(data.duration_minutes),
      data.show_datetime,
      data.poster_url || null,
      id
    ]);
  }

  static async hasSeats(showId) {
  const pool = await getPool();
  const [[row]] = await pool.query(
      `
      SELECT COUNT(*) AS cnt
      FROM show_seats
      WHERE show_id = ?
      `,
      [showId]
  );
    return row.cnt > 0;
  }

  static async isSeatAvailable(showId, seatId) {
    const pool = await getPool();
    const [[row]] = await pool.query(
      "SELECT status FROM show_seats WHERE show_id=? AND seat_id=?",
      [showId, seatId]
    );
    return row && row.status === "available";
  }

  static async createShowSeats(showId, hallId) {
    const pool = await getPool();

    await pool.query(`
      INSERT INTO show_seats (show_id, seat_id)
      SELECT ?, id FROM seats WHERE hall_id = ?
    `, [showId, hallId]);
  }

  static async remove(id) {
    const pool = await getPool();
    await pool.query("DELETE FROM shows WHERE id = ?", [id]);
  }

}

module.exports = ShowRepository;
