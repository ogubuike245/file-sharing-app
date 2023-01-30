const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads" });
const {
  getAllUploads,
  uploadPage,
  editPage,
  handleUpload,
  downloadPage,
  handleDelete,
  singleDocumentPage,
  handleEdit,
  handleDownload,
} = require("../../controllers/main/controller");

router.get("/", getAllUploads);
router.get("/upload", uploadPage);
router.get("/download/:id", downloadPage);
router.get("/document/:id", singleDocumentPage);
router.get("/edit/:id", editPage);
router.post("/upload", upload.single("file"), handleUpload);
router.post("/download/:id", handleDownload);
router.post("/edit/:id", handleEdit);
router.delete("/delete/:id", handleDelete);

module.exports = router;

//APP ROUTES
