const express = require("express");
const router = express.Router();
const multer = require("multer");

// const upload = multer({ dest: "dist/uploads" });
const upload = multer({ dest: "/tmps" });
const {
  handleUpload,
  handleDelete,
  handleEdit,
  handleDownload,
} = require("../../../controllers/main/course/course.controller");
const {
  uploadPage,
  editPage,
  downloadPage,
  singleDocumentPage,
  getSingleCourseDocuments,
  getAllUploads,
} = require("../../../controllers/main/course/pages.controller");

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
