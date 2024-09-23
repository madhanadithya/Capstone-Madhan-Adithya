
const FileUpload = require("../models/filesUpload");
const multer = require("multer");
const path = require("path");
const { body, validationResult } = require("express-validator");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage }).array("files", 2); 

const validateUpload = (req, res, next) => {

  if (!req.files || req.files.length !== 2) {
    return res
      .status(400)
      .json({ errors: [{ msg: "Exactly 2 files are required" }] });
  }
  next();
};

exports.uploadFiles = [
  upload,
  validateUpload,
  async (req, res) => {
    try {
      const filePaths = req.files.map((file) => file.path);

      const newFileUpload = new FileUpload({
        files: filePaths,
      });

      const savedFiles = await newFileUpload.save();
      res.status(201).json(savedFiles);
    } catch (error) {
      res.status(500).json({
        message: "Error saving file information",
        error: error.message,
      });
    }
  },
];

exports.getAllUploads = async (req, res) => {
  try {
    const uploads = await FileUpload.find();
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
