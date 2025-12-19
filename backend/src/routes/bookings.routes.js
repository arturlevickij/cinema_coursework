const express = require("express");
const BookingController = require("../controllers/bookings.controller");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

const userOnly = require("../middleware/user.middleware");

router.post("/", auth, userOnly, BookingController.createBooking);
router.get("/my", auth, userOnly, BookingController.getMyBookings);
router.patch("/:id/cancel", auth, userOnly, BookingController.cancelBooking);
router.delete("/:id", auth, userOnly, BookingController.deleteBooking);
router.post("/:id/purchase", auth, userOnly, BookingController.purchaseBooking);
router.get("/:id/price", auth, BookingController.getBookingPrice);


module.exports = router;
