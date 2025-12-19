const { getPool } = require("../config/db");
const { BOOKING_TTL_MINUTES } = require("../config/constants");
const BookingRepo = require("../repositories/booking.repository");

class BookingExpireService {
  static async cancelExpiredBookings() {
    const pool = await getPool();

    const [expired] = await pool.query(`
      SELECT id
      FROM bookings
      WHERE status = 'active'
        AND booking_time < NOW() - INTERVAL ? MINUTE
    `, [BOOKING_TTL_MINUTES]);

    for (const b of expired) {
      await BookingRepo.markBookingAsCanceled(b.id);
      await BookingRepo.releaseSeatsByBooking(b.id);
      await BookingRepo.clearBookingSeats(b.id);
    }

    if (expired.length) {
      console.log(`⏱ Auto-canceled: ${expired.length} bookings`);
    }
  }
}

module.exports = BookingExpireService;
