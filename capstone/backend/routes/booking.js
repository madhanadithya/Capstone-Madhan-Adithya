const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all bookings
router.get("/", bookingController.getAllBookings);

// Get booking by ID
router.get("/:id", bookingController.getBookingById);

// Create a new booking
router.post("/", bookingController.createBooking);

// Update a booking by ID
router.put("/:id", bookingController.updateBookingById);

// Delete a booking by ID
router.delete("/:id", bookingController.deleteBookingById);

// Get bookings for logged-in customer
router.get(
  "/customer/bookings",
  authMiddleware,
  bookingController.getCustomerBookings
);

router.get("/provider/:providerId", bookingController.getBookingsByProviderId);

module.exports = router;
