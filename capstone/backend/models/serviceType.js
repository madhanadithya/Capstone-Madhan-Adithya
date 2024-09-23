const mongoose = require("mongoose");

const serviceTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  image: { type: String }, 
});

module.exports = mongoose.model("ServiceType", serviceTypeSchema);
