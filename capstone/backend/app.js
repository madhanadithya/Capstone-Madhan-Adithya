const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const providerRoutes = require("./routes/provider");
const consumerRoutes = require("./routes/consumer");
const filesUploadRoutes = require("./routes/filesUpload");
const otpRoutes = require("./routes/otp");
const ratingRoutes = require("./routes/rating");
const bookingRoutes = require("./routes/booking");

// Initialize app
const app = express();

// Middleware
app.use(bodyParser.json());

app.use(cors());

// Connect to MongoDB
mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/consumer", consumerRoutes);
app.use("/api/filesUpload", filesUploadRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/bookings", bookingRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
