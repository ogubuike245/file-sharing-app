const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "/tmp" });
const {
  getAllUploads,
  uploadPage,
  handleUpload,
  downloadPage,
  handleDelete,
  singleDocumentPage,
  handleDownload,
} = require("../../controllers/main/controller");

router.get("/", getAllUploads);
router.get("/upload", uploadPage);
router.get("/download/:id", downloadPage);
router.get("/document/:id", singleDocumentPage);
router.post("/upload", upload.single("file"), handleUpload);
router.post("/download/:id", handleDownload);
router.delete("/delete/:id", handleDelete);

module.exports = router;

//APP ROUTES
