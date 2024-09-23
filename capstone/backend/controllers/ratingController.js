const Rating = require("../models/rating");
const { body, validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");

exports.createRating = [

  body("provider_id")
    .isMongoId()
    .withMessage("Invalid Provider ID")
    .notEmpty()
    .withMessage("Provider ID is required"),
  body("service_id")
    .isMongoId()
    .withMessage("Invalid Service ID")
    .notEmpty()
    .withMessage("Service ID is required"),
  body("rating")
    .isNumeric()
    .withMessage("Rating must be a number")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5")
    .notEmpty()
    .withMessage("Rating is required"),
  body("comments")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Comments must be at most 500 characters long"),
  body("customer_id")
    .isMongoId()
    .withMessage("Invalid Customer ID")
    .notEmpty()
    .withMessage("Customer ID is required"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { provider_id, service_id, rating, comments, customer_id } = req.body;

    const sanitizedComments = comments ? sanitizeHtml(comments) : "";

    try {
      const newRating = new Rating({
        provider_id,
        service_id,
        rating,
        comments: sanitizedComments, 
        customer_id,
      });

      const savedRating = await newRating.save();
      res.status(201).json(savedRating);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
];

// Get average rating for a provider
exports.getAverageProviderRating = async (req, res) => {
  const { provider_id } = req.params;

  try {
    const ratings = await Rating.find({ provider_id });
    if (ratings.length === 0)
      return res.json({ message: "No ratings found for this provider" });

    const roundedRating =
      ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length;
    const averageRating = Math.floor(roundedRating * 10) / 10;
    res.status(200).json({ provider_id, averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get average rating for a service
exports.getAverageServiceRating = async (req, res) => {
  const { service_id } = req.params;

  try {
    const ratings = await Rating.find({ service_id });
    if (ratings.length === 0)
      return res
        .status(404)
        .json({ message: "No ratings found for this service" });

    const averageRating =
      ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length;
    res.status(200).json({ service_id, averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
