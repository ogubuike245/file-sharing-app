const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyOTP,
  reSendOTP,
  getAll,
  userLogout,
} = require("../../../controllers/main/auth/auth.controller");
const {
  register,
  login,
  verifyPAGE,
} = require("../../../controllers/main/auth/pages.controller");
const { isLoggedIn } = require("../../../middlewares/auth/auth.middleware");

router.get("/all", getAll);
router.get("/register", isLoggedIn, register);
router.get("/verify/:email", isLoggedIn, verifyPAGE);
router.get("/login", isLoggedIn, login);
router.get("/logout", userLogout);

router.post("/otp", isLoggedIn, reSendOTP);
router.post("/register", isLoggedIn, registerUser);
router.post("/verify/email", isLoggedIn, verifyOTP);
router.post("/login", isLoggedIn, loginUser);

module.exports = router;

//AUTH ROUTES
