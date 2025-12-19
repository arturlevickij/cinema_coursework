const { getPool } = require("../config/db");

class TicketRepository {
  static async create({ bookingId, seatId, price, discountId }) {
    const pool = await getPool();
    const [result] = await pool.query(
      `INSERT INTO tickets (booking_id, seat_id, price, discount_id)
       VALUES (?, ?, ?, ?)`,
      [bookingId, seatId, price, discountId]
    );
    return result.insertId;
  }
}

module.exports = TicketRepository;
