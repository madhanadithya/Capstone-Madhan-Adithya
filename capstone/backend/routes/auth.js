const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUserDetails,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); 
const roleMiddleware = require("../middleware/roleMiddleware"); 

router.post("/register", register);
router.post("/login", login);

router.get("/user", authMiddleware, getUserDetails);

module.exports = router;
