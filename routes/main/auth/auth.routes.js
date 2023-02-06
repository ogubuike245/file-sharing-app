const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyOTP,
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
router.get("/verify/:email", verifyPAGE);
router.get("/login", isLoggedIn, login);
router.get("/logout", userLogout);

router.post("/register", registerUser);
router.post("/verify/email", verifyOTP);
router.post("/login", loginUser);

module.exports = router;

//AUTH ROUTES
