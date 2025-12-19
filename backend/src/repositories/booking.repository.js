const { getPool } = require("../config/db");

class BookingRepository {

  static async isSeatAvailable(showId, seatId) {
    const pool = await getPool();
    const [[row]] = await pool.query(
      "SELECT status FROM show_seats WHERE show_id=? AND seat_id=?",
      [showId, seatId]
    );
    return row?.status === "available";
  }

  static async createBooking(userId, showId) {
    const pool = await getPool();
    const [res] = await pool.query(
      "INSERT INTO bookings (user_id, show_id) VALUES (?, ?)",
      [userId, showId]
    );
    return res.insertId;
  }

  static async addSeatToBooking(bookingId, seatId) {
    const pool = await getPool();
    await pool.query(
      "INSERT INTO booking_seats VALUES (?, ?)",
      [bookingId, seatId]
    );
  }

  static async bookSeat(showId, seatId) {
    const pool = await getPool();
    await pool.query(
      "UPDATE show_seats SET status='booked' WHERE show_id=? AND seat_id=?",
      [showId, seatId]
    );
  }

  static async releaseSeatsByBooking(bookingId) {
    const pool = await getPool();
    await pool.query(
      `
      UPDATE show_seats ss
      JOIN booking_seats bs ON bs.seat_id = ss.seat_id
      SET ss.status='available'
      WHERE bs.booking_id=?
      `,
      [bookingId]
    );
  }

  static async getBookingById(id) {
    const pool = await getPool();
    const [[row]] = await pool.query(
      "SELECT * FROM bookings WHERE id=?",
      [id]
    );
    return row;
  }

  static async deleteBooking(id) {
    const pool = await getPool();
    await pool.query(
      "DELETE FROM bookings WHERE id=? AND status='canceled'",
      [id]
    );
  }

  static async markBookingAsCanceled(id) {
    const pool = await getPool();
    await pool.query(
      "UPDATE bookings SET status='canceled' WHERE id=?",
      [id]
    );
  }

  static async markBookingAsPaid(id) {
    const pool = await getPool();
    await pool.query(
      "UPDATE bookings SET status='paid' WHERE id=?",
      [id]
    );
  }

  static async getUserBookingsDetailed(userId) {
    const pool = await getPool();
    const [rows] = await pool.query(
      `
      SELECT 
        b.id AS booking_id,
        b.show_id,
        b.status,
        b.expires_at,
        s.row_no,
        s.seat_no
      FROM bookings b
      LEFT JOIN booking_seats bs ON bs.booking_id = b.id
      LEFT JOIN seats s ON s.id = bs.seat_id
      WHERE b.user_id = ?
      ORDER BY b.booking_time DESC
      `,
      [userId]
    );
    return rows;
  }

  static async getBookingSeats(bookingId) {
    const pool = await getPool();
    const [rows] = await pool.query(
      `
      SELECT seat_id
      FROM booking_seats
      WHERE booking_id = ?
      `,
      [bookingId]
    );
    return rows.map(r => r.seat_id);
  }

  static async clearBookingSeats(bookingId) {
    const pool = await getPool();

    await pool.query(
      "DELETE FROM booking_seats WHERE booking_id = ?",
      [bookingId]
    );
  }

  static async updateStatus(bookingId, status) {
    const pool = await getPool();

    await pool.query(
      "UPDATE bookings SET status = ? WHERE id = ?",
      [status, bookingId]
    );
  }

  static async getById(id) {
    const pool = await getPool();

    const [[row]] = await pool.query(
      "SELECT * FROM bookings WHERE id = ?",
      [id]
    );

    return row;
  }

}

module.exports = BookingRepository;
