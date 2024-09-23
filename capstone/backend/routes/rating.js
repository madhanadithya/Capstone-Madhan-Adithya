// const express = require("express");
// const router = express.Router();
// const {
//   getRatings,
//   getRatingById,
//   createRating,
//   updateRating,
//   deleteRating,
//   getRatingsByProviderId,
//   getRatingsByServiceId,
//   getAverageRatingByProviderId,
//   getAverageRatingByServiceId,
// } = require("../controllers/ratingController");
// const authMiddleware = require("../middleware/authMiddleware");
// const roleMiddleware = require("../middleware/roleMiddleware");

// //get all and by id

// router.get("/", getRatings);

// router.get("/:id", getRatingById);

// //get by provider and service

// router.get("/provider/:provider_id", getRatingsByProviderId);

// router.get("/service/:service_id", getRatingsByServiceId);

// //get rating by average for provider and service....

// router.get("/provider/:provider_id/average", getAverageRatingByProviderId);

// router.get("/service/:service_id/average", getAverageRatingByServiceId);

// // add new rating

// router.post("/", authMiddleware, roleMiddleware(["consumer"]), createRating);

// router.put("/:id", updateRating);

// router.delete("/:id", deleteRating);

// module.exports = router;

// routes/ratings.js
const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
// const { verifyToken, customerOnly } = require("../middlewares/authorization");

// Create a rating (Customer only)
router.post("/", ratingController.createRating);

// Get average rating for a provider
router.get("/provider/:provider_id", ratingController.getAverageProviderRating);

// Get average rating for a service
router.get("/service/:service_id", ratingController.getAverageServiceRating);

module.exports = router;
