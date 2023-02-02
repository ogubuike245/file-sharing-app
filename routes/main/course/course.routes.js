const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// const upload = multer({ dest: "/tmp" });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
  getAllUploads,
  uploadPage,
  editPage,
  handleUpload,
  downloadPage,
  handleDelete,
  singleDocumentPage,
  getSingleCourseDocuments,
  handleEdit,
  handleDownload,
} = require("../../../controllers/main/course.controller");

router.get("/", getAllUploads);
router.get("/upload", uploadPage);
router.get("/download/:id", downloadPage);
router.get("/document/:id", singleDocumentPage);
router.get("/document/course/:course", getSingleCourseDocuments);
router.get("/edit/:id", editPage);
router.post("/upload", upload.single("file"), handleUpload);
router.post("/download/:id", handleDownload);
router.post("/edit/:id", upload.single("file"), handleEdit);
router.delete("/delete/:id", handleDelete);

module.exports = router;

//APP ROUTES

// Upload file route
