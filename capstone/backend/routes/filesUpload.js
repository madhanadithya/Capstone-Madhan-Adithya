const express = require("express");
const router = express.Router();
const filesUploadController = require("../controllers/filesUploadController");

// Route to upload files
router.post("/upload", filesUploadController.uploadFiles);

// Route to get all uploads (optional)
router.get("/", filesUploadController.getAllUploads);

module.exports = router;
