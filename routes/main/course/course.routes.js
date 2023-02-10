const express = require("express");
const router = express.Router();
const multer = require("multer");

// const upload = multer({ dest: "dist/uploads" });
const upload = multer({ dest: "/tmp" });
const {
  handleUpload,
  handleDelete,
  handleEdit,
  handleEditPassowrd,
  handleEditUploadedDocument,
  handleDownload,
} = require("../../../controllers/main/course/course.controller");
const {
  uploadPage,
  editPage,
  downloadPage,
  // getIntroPage,
  getCourseCategory,
  getUploadedDocumentDetail,
  editPasswordPage,
  editFileUploadedPage,
  getHomePage,
} = require("../../../controllers/main/course/pages.controller");
const {
  checkAdmin,
  isLoggedIn,
  tokenVerification,
  checkForLoggedInUser,
} = require("../../../middlewares/auth/auth.middleware");

// PAGE ONLY ROUTES

// router.get("/", isLoggedIn, getIntroPage);
router.get("/", getHomePage);
router.get("/upload", checkAdmin, uploadPage);
router.get("/edit/:id", checkAdmin, editPage);
router.get("/edit/password/:id", checkAdmin, editPasswordPage);
router.get("/edit/file/:id", checkAdmin, editFileUploadedPage);
router.get("/category/:title", getCourseCategory);
router.get("/details/:id", getUploadedDocumentDetail);
router.get("/download/:id", downloadPage);

// OTHER ROUTES
router.post(
  "/upload",
  checkForLoggedInUser,
  checkAdmin,
  upload.single("file"),
  handleUpload
);
router.post("/edit/course/:id", checkForLoggedInUser, checkAdmin, handleEdit);
router.post(
  "/edit/course/password/:id",
  checkForLoggedInUser,
  checkAdmin,
  handleEditPassowrd
);
router.post(
  "/edit/course/file/:id",
  checkForLoggedInUser,
  checkAdmin,
  upload.single("file"),
  handleEditUploadedDocument
);
router.delete("/delete/:id", checkForLoggedInUser, checkAdmin, handleDelete);
router.post("/download/:id", handleDownload);

module.exports = router;
