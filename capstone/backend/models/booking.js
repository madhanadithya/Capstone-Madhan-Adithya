const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  slot: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "canceled"],
    default: "pending",
  },
  proofImage: {
    type: String,
  },
  otp: {
    type: Number,
  },
  paymentMethod: {
    type: String,
    enum: ["net banking", "upi", "pay after service"],
    required: true,
  },
  payAfterServiceOption: {
    type: String,
    enum: ["pay online", "pay cash"],
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
