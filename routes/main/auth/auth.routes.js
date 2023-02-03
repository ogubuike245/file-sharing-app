const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  requestOTP,
  verifyOTP,
} = require("../../../controllers/main/auth/auth.controller");
const {
  register,
  login,
} = require("../../../controllers/main/auth/pages.controller");

router.get("/register", register);
router.get("/login", login);
router.post("/otp/request", requestOTP);
router.post("/otp/verify", verifyOTP);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;

//AUTH ROUTES
