const bookingEvents = require("./booking.events");
const { getPool } = require("../config/db");

bookingEvents.on("bookingPaid", async (payload) => {
  const { bookingId, showId, userId, total } = payload;
  const pool = await getPool();

  await pool.query(
    `
    INSERT INTO booking_logs (booking_id, show_id, user_id, total_amount, event_type)
    VALUES (?, ?, ?, ?, 'PAID')
    `,
    [bookingId, showId, userId, total]
  );
});

bookingEvents.on("bookingCanceled", async (payload) => {
  const { bookingId, showId, userId } = payload;
  const pool = await getPool();

  await pool.query(
    `
    INSERT INTO booking_logs (booking_id, show_id, user_id, event_type)
    VALUES (?, ?, ?, 'CANCELED')
    `,
    [bookingId, showId, userId]
  );
});
