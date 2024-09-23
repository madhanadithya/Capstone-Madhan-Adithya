const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceType",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: { type: Number, required: true }, 
    timeRequired: { type: String, required: true }, 
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    image: { type: String }, 
  },
  { timestamps: true }
); 

module.exports = mongoose.model("Service", serviceSchema);
