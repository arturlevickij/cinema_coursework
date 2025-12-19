const EventEmitter = require("events");

class BookingEventEmitter extends EventEmitter {}

const bookingEvents = new BookingEventEmitter();

module.exports = bookingEvents;
