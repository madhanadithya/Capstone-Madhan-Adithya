const OTP = require("../models/otp");
const crypto = require("crypto");
const axios = require("axios");
const https = require("https");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const sendSMS = async (to, body) => {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;

  const data = new URLSearchParams({
    To: to,
    From: process.env.TWILIO_PHONE_NUMBER,
    Body: body,
  });

  const auth = Buffer.from(
    `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
  ).toString("base64");

  try {
    const response = await axios.post(url, data.toString(), {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      httpsAgent: agent, 
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

const validateSendOTP = [
  body("phone")
    .isMobilePhone() 
    .withMessage("Invalid phone number")
    .escape(), 
  body("filesUpload")
    .optional()
    .isMongoId() 
    .withMessage("Invalid files upload ID"),
];

exports.sendOTP = [

  body("phone")
    .matches(/^\+\d{12}$/)
    .withMessage('Phone number must start with "+" followed by 12 digits')
    .isLength({ min: 13, max: 13 })
    .withMessage("Phone number must be exactly 13 characters long")
    .trim(),
  body("filesUpload").isMongoId().withMessage("Invalid files upload ID"),
  body("provider_id").isMongoId().withMessage("Invalid Provider ID").notEmpty(),
  body("service_id").isMongoId().withMessage("Invalid Service ID").notEmpty(),
  body("user_id").isMongoId().withMessage("Invalid User ID").notEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    console.log("Hi", req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, filesUpload, provider_id, service_id, user_id } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

    const ratingLink = `http://localhost:3000/rate-service/${provider_id}/${service_id}/${user_id};`;

    try {
      // Send OTP via Twilio
      await sendSMS(
        phone,
        `Your OTP is ${otp}. Click the link to rate the service: ${ratingLink}`
      );

      // Create and save OTP record
      const otpRecord = new OTP({
        phone,
        otp,
        expiresAt,
        ratingLink,
        filesUpload,
      });

      await otpRecord.save();

      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to send OTP", error: error.message });
    }
  },
];

// Middleware for verifying OTP input
const validateVerifyOTP = [
  body("phone").isMobilePhone().withMessage("Invalid phone number").escape(),
  body("otp")
    .isNumeric()
    .withMessage("OTP must be a number")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
  body("filesUpload").isMongoId().withMessage("Invalid files upload ID"),
];

// Verify OTP
exports.verifyOTP = [
  ...validateVerifyOTP,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, otp, filesUpload } = req.body;

    try {
      // Find the OTP record and populate the filesUpload field
      const otpRecord = await OTP.findOne({ phone, otp }).populate(
        "filesUpload"
      );

      if (!otpRecord) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
      if (new Date() > otpRecord.expiresAt) {
        return res.status(400).json({ message: "OTP expired" });
      }

      // Check if the provided filesUploadId matches the OTP record's filesUpload ID
      if (
        !otpRecord.filesUpload ||
        !otpRecord.filesUpload._id.equals(filesUpload)
      ) {
        return res.status(400).json({ message: "Invalid files upload ID" });
      }

      res.status(200).json({
        message: "OTP verified successfully",
        ratingLink: otpRecord.ratingLink,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to verify OTP", error: error.message });
    }
  },
];
