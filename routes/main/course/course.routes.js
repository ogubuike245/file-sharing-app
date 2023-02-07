const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "dist/uploads" });
// const upload = multer({ dest: "/tmp" });
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
const { checkAdmin } = require("../../../middlewares/auth/auth.middleware");

// PAGE ONLY ROUTES

router.get("/", getAllUploads);
router.get("/upload", checkAdmin, uploadPage);
router.get("/edit/:id", checkAdmin, editPage);
router.get("/document/:id", singleDocumentPage);
router.get("/document/course/:course", getSingleCourseDocuments);
router.get("/download/:id", downloadPage);

// OTHER ROUTES
router.post("/upload", checkAdmin, upload.single("file"), handleUpload);
router.post("/edit/:id", checkAdmin, upload.single("file"), handleEdit);
router.delete("/delete/:id", checkAdmin, handleDelete);
router.post("/download/:id", handleDownload);

module.exports = router;

//APP ROUTES
