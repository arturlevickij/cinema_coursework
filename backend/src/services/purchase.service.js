const BookingRepo = require("../repositories/booking.repository");
const PricingService = require("./pricing.service");
const bookingEvents = require("../events/booking.events");

const { getPool } = require("../config/db");

class PurchaseService {
  static async purchaseBooking(bookingId, userId, discountId = null) {
    const pool = await getPool();

    const booking = await BookingRepo.getById(bookingId);

    if (!booking) {
      throw new Error("Бронювання не знайдено");
    }

    if (booking.user_id !== userId) {
      throw new Error("Це бронювання належить іншому користувачу");
    }

    if (booking.status !== "active") {
      throw new Error("Бронювання неактивне");
    }

    if (booking.expires_at && new Date(booking.expires_at) < new Date()) {
      await BookingRepo.updateStatus(bookingId, "canceled");
      await BookingRepo.releaseSeatsByBooking(bookingId);
      throw new Error("Час бронювання вийшов");
    }

    const seatIds = await BookingRepo.getBookingSeats(bookingId);

    if (!seatIds.length) {
      throw new Error("У бронюванні немає місць");
    }

    const pricing = await PricingService.calculateTotal(
      seatIds,
      discountId,
      "dynamic",
      booking.show_id
    );


    const [paymentRes] = await pool.query(
      `
      INSERT INTO payments 
        (booking_id, total_amount, discount_id, discount_amount, status)
      VALUES (?, ?, ?, ?, 'success')
      `,
      [
        bookingId,
        pricing.finalTotal,
        discountId,
        pricing.discountAmount
      ]
    );

    const paymentId = paymentRes.insertId;

    const perSeatPrice = pricing.finalTotal / seatIds.length;

    for (const seatId of seatIds) {
      await pool.query(
        `
        INSERT INTO tickets (booking_id, seat_id, price, discount_id)
        VALUES (?, ?, ?, ?)
        `,
        [
          bookingId,
          seatId,
          perSeatPrice,
          discountId
        ]
      );
    }

    await BookingRepo.markBookingAsPaid(bookingId);


    bookingEvents.emit("bookingPaid", {
      bookingId,
      showId: booking.show_id,
      userId,
      total: pricing.finalTotal
    });

    return {
      bookingId,
      paymentId,
      baseTotal: pricing.baseTotal,
      finalTotal: pricing.finalTotal,
      discountAmount: pricing.discountAmount
    };
  }

  static async previewBookingPrice(bookingId, userId, discountId = null) {
    const booking = await BookingRepo.getById(bookingId);

    if (!booking) throw new Error("Бронювання не знайдено");
    if (booking.user_id !== userId) throw new Error("Це бронювання належить іншому користувачу");
    if (booking.status !== "active") throw new Error("Бронювання неактивне");

    if (booking.expires_at && new Date(booking.expires_at) < new Date()) {
      throw new Error("Час бронювання вийшов");
    }

    const seatIds = await BookingRepo.getBookingSeats(bookingId);
    if (!seatIds.length) throw new Error("У бронюванні немає місць");

    const pricing = await PricingService.calculateTotal(
      seatIds,
      discountId,
      "dynamic",
      booking.show_id
    );

    return pricing;
  }

}


module.exports = PurchaseService;
