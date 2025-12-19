const BookingRepo = require("../repositories/booking.repository");
const { getPool } = require("../config/db");
const bookingEvents = require("../events/booking.events");

class BookingService {
  static async createBooking(userId, showId, seatIds) {
    const pool = await getPool();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // +5 хв

    const [res] = await pool.query(
      `
      INSERT INTO bookings (user_id, show_id, status, expires_at)
      VALUES (?, ?, 'active', ?)
      `,
      [userId, showId, expiresAt]
    );

    const bookingId = res.insertId;

    for (const seatId of seatIds) {
      await pool.query(
        "INSERT INTO booking_seats (booking_id, seat_id) VALUES (?, ?)",
        [bookingId, seatId]
      );

      await pool.query(
        `
        UPDATE show_seats
        SET status = 'booked'
        WHERE show_id = ? AND seat_id = ?
        `,
        [showId, seatId]
      );
    }

    return {
      id: bookingId,
      expires_at: expiresAt
    };
  }


  static async cancelBooking(bookingId, userId) {
    const booking = await BookingRepo.getBookingById(bookingId);

    if (!booking || booking.user_id !== userId) {
      throw new Error("Бронювання не знайдено");
    }

    if (booking.status !== "active") {
      throw new Error("Можна скасувати лише активне бронювання");
    }

    await BookingRepo.markBookingAsCanceled(bookingId);
    await BookingRepo.releaseSeatsByBooking(bookingId);

    bookingEvents.emit("bookingCanceled", {
      bookingId,
      showId: booking.show_id,
      userId
    });
  }

  static async deleteBooking(bookingId, userId) {
    const booking = await BookingRepo.getBookingById(bookingId);

    if (!booking || booking.user_id !== userId) {
      throw new Error("Бронювання не знайдено");
    }

    if (booking.status !== "canceled") {
      throw new Error("Можна видалити лише скасоване бронювання");
    }

    await BookingRepo.deleteBooking(bookingId);
  }

  static async getUserBookings(userId) {
    return BookingRepo.getUserBookingsDetailed(userId);
  }

  static isExpired(booking) {
    if (!booking.expires_at) return false;
    return new Date(booking.expires_at) < new Date();
  }


}

module.exports = BookingService;
