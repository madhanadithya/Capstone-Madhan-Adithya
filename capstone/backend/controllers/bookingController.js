const { body, validationResult } = require("express-validator");
const Booking = require("../models/booking");

exports.createBooking = [
  
  body("serviceId").isMongoId().withMessage("Invalid service ID").escape(),
  body("serviceProviderId")
    .isMongoId()
    .withMessage("Invalid service provider ID")
    .escape(),
  body("customerId").isMongoId().withMessage("Invalid customer ID").escape(),
  body("location").isString().trim().escape(),
  body("slot")
    .isISO8601()
    .toDate()
    .withMessage("Invalid date and time")
    .escape(),
  body("status").optional().isString().trim().escape(), 
  body("proofImage").optional().isString().trim().escape(),
  body("otp")
    .optional()
    .isNumeric()
    .withMessage("OTP must be a number")
    .escape(), 
  body("paymentMethod")
    .isIn(["net banking", "upi", "pay after service"])
    .withMessage("Invalid payment method"),
  body("payAfterServiceOption")
    .optional()
    .isIn(["pay online", "pay cash"])
    .withMessage("Invalid option for pay after service"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      serviceId,
      serviceProviderId,
      customerId,
      location,
      slot,
      status,
      proofImage,
      otp,
      paymentMethod,
      payAfterServiceOption,
    } = req.body;

    const booking = new Booking({
      serviceId,
      serviceProviderId,
      customerId,
      location,
      slot,
      status, // This can now be omitted
      proofImage, // This can now be omitted
      otp, // This can now be omitted
      paymentMethod,
      payAfterServiceOption,
    });

    try {
      const newBooking = await booking.save();
      res.status(201).json(newBooking);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
];

exports.updateBookingById = [

  body("serviceId")
    .optional()
    .isMongoId()
    .withMessage("Invalid service ID")
    .escape(),
  body("serviceProviderId")
    .optional()
    .isMongoId()
    .withMessage("Invalid service provider ID")
    .escape(),
  body("customerId")
    .optional()
    .isMongoId()
    .withMessage("Invalid customer ID")
    .escape(),
  body("location").optional().isString().trim().escape(),
  body("slot")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid date and time")
    .escape(),
  body("status").optional().isString().trim().escape(),
  body("proofImage").optional().isString().trim().escape(),
  body("otp")
    .optional()
    .isNumeric()
    .withMessage("OTP must be a number")
    .escape(),
  body("paymentMethod")
    .optional()
    .isIn(["net banking", "upi", "pay after service"])
    .withMessage("Invalid payment method"),
  body("payAfterServiceOption")
    .optional()
    .isIn(["pay online", "pay cash"])
    .withMessage("Invalid option for pay after service"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
        .populate("serviceId")
        .populate("serviceProviderId")
        .populate("customerId");
      if (!booking)
        return res.status(404).json({ message: "Booking not found" });
      res.json(booking);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
];

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("serviceId")
      .populate("serviceProviderId")
      .populate("customerId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("serviceId")
      .populate("serviceProviderId")
      .populate("customerId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a booking by ID
exports.deleteBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bookings for the logged-in customer
exports.getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.user.userId; // Assuming user ID is stored in req.user
    const bookings = await Booking.find({ customerId })
      .populate("serviceId")
      .populate("serviceProviderId")
      .populate("customerId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bookings by service provider ID
exports.getBookingsByProviderId = async (req, res) => {
  const { providerId } = req.params;

  try {
    const bookings = await Booking.find({ serviceProviderId: providerId })
      .populate("serviceId")
      .populate("customerId");

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this provider" });
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
