// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// // Rating Schema
// const RatingSchema = new Schema(
//   {
//     score: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 5, // Ensure the score is between 1 and 5
//     },
//     comment: {
//       type: String,
//       required: true, // Making the comment required as well
//     },
//     customerID: {
//       // type: String,
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true, // Making the customerID required as well
//     },
//     provider_id: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     related_to: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Service",
//       required: false,
//     },
//   },
//   {
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
//   }
// );

// module.exports = mongoose.model("Rating", RatingSchema);

// models/rating.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
  provider_id: {
    type: Schema.Types.ObjectId,
    ref: "Provider",
    required: true,
  },
  service_id: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5, // Assuming a rating scale from 1 to 5
    required: true,
  },
  comments: {
    type: String,
    required: false,
  },
  customer_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Rating", RatingSchema);
