const express = require("express");
const router = express.Router();
const multer = require("multer");

// const upload = multer({ dest: "dist/uploads" });
const upload = multer({ dest: "/tmp" });
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
  getIntroPage,
  getCourseCategory,
  getUploadedDocumentDetail,
  getHomePage,
} = require("../../../controllers/main/course/pages.controller");
const {
  checkAdmin,
  isLoggedIn,
  tokenVerification,
} = require("../../../middlewares/auth/auth.middleware");

// PAGE ONLY ROUTES

// router.get("/", isLoggedIn, getIntroPage);
router.get("/", getHomePage);
router.get("/upload", checkAdmin, uploadPage);
router.get("/edit/:id", checkAdmin, editPage);
router.get("/category/:title", getCourseCategory);
router.get("/details/:id", getUploadedDocumentDetail);
router.get("/download/:id", downloadPage);

// OTHER ROUTES
router.post("/upload", checkAdmin, upload.single("file"), handleUpload);
router.post("/edit/course/:id", handleEdit);
router.delete("/delete/:id", checkAdmin, handleDelete);
router.post("/download/:id", handleDownload);

module.exports = router;

//APP ROUTES
