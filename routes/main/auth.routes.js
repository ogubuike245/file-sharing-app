const express = require("express");
const router = express.Router();

const {
  register,
  login,
  registerUser,
  loginUser,
} = require("../../controllers/main/auth.controller");

router.get("/register", register);
router.get("/login", login);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;

//AUTH ROUTES
