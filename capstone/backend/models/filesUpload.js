const mongoose = require("mongoose");

const fileUploadSchema = new mongoose.Schema({
  files: [
    {
      type: String,
      required: true,
    },
  ],
});

const FileUpload = mongoose.model("FileUpload", fileUploadSchema);

module.exports = FileUpload;
