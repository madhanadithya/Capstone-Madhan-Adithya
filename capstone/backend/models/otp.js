const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  phone: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  ratingLink: {
    type: String,
    required: true,
  },
  filesUpload: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FileUpload",
    required: true,
  },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
