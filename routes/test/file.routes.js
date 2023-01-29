const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads" });
const {
  handleDownload,
  handleUpload,
  getAllUploads,
  handleDelete,
} = require("../../controllers/test/file.controller");

router.get("/", getAllUploads);
router.delete("/delete/:id", handleDelete);
router.post("/upload", upload.single("file"), handleUpload);

router.route("/file/:id").get(handleDownload).post(handleDownload);

module.exports = router;
