const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { body, validationResult } = require("express-validator");

const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const COOLDOWN_TIME = 15 * 60 * 1000;

exports.register = [
  body("username").isString().trim().escape().notEmpty(),
  body("phoneNumber").isString().trim().escape().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }).trim().escape(),
  body("role").optional().isString().trim().escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, phoneNumber, email, password, role } = req.body;

    try {
      const user = new User({ username, phoneNumber, email, password, role });
      await user.save();
      console.log(user);

      const payload = { userId: user._id, role: user.role };
      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });

      res.status(201).json({ token });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
];

exports.login = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }).trim().escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const userAttempts = loginAttempts[email];
    if (userAttempts && userAttempts.count >= MAX_ATTEMPTS) {
      const timeLeft = COOLDOWN_TIME - (Date.now() - userAttempts.firstAttempt);
      if (timeLeft > 0) {
        return res.status(429).json({
          msg: `Too many attempts. Please wait ${Math.ceil(
            timeLeft / 1000
          )} seconds.`,
        });
      } else {
        delete loginAttempts[email];
      }
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        trackLoginAttempt(email);
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        trackLoginAttempt(email);
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      delete loginAttempts[email];

      const payload = { userId: user._id, role: user.role };
      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });

      res.json({ token });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
];

function trackLoginAttempt(email) {
  const now = Date.now();
  if (!loginAttempts[email]) {
    loginAttempts[email] = { count: 1, firstAttempt: now };
  } else {
    loginAttempts[email].count += 1;
  }
}

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
