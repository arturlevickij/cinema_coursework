const app = require("./app");
const BookingExpireService = require("./services/bookingExpire.service");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setInterval(() => {
  BookingExpireService.cancelExpiredBookings()
    .catch(err => console.error("Expire error:", err));
}, 60 * 1000);
