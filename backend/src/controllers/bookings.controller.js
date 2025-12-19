const BookingService = require("../services/bookings.service");
const PurchaseService = require("../services/purchase.service");

class BookingController {
  static async createBooking(req, res) {
    try {
      const booking = await BookingService.createBooking(
        req.user.id,
        req.body.show_id,
        req.body.seat_ids
      );

      res.status(201).json({
        id: booking.id,
        expires_at: booking.expires_at,
        message: "Місця заброньовано. У вас є 5 хвилин на оплату."
      });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  static async getMyBookings(req, res) {
    const bookings = await BookingService.getUserBookings(req.user.id);
    res.json(bookings);
  }

  static async cancelBooking(req, res) {
    try {
      await BookingService.cancelBooking(req.params.id, req.user.id);
      res.json({ message: "Бронювання скасовано" });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  static async deleteBooking(req, res) {
    try {
      await BookingService.deleteBooking(req.params.id, req.user.id);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  static async purchaseBooking(req, res) {
    try {
      const result = await PurchaseService.purchaseBooking(
        req.params.id,
        req.user.id,
        req.body.discount_id
      );
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  static async getBookingPrice(req, res) {
    try {
      const result = await PurchaseService.previewBookingPrice(
        req.params.id,
        req.user.id,
        req.query.discount_id ? Number(req.query.discount_id) : null
      );
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

}

module.exports = BookingController;
