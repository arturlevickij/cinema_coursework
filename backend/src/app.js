const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./events/booking.observers");

const authRoutes = require("./routes/auth.routes");
const showsRoutes = require("./routes/shows.routes");
const bookingsRoutes = require("./routes/bookings.routes");
const adminRoutes = require("./routes/admin.routes");
const discountsRoutes = require("./routes/discounts.routes");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Ticket Booking API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/shows", showsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/discounts", discountsRoutes);

module.exports = app;
