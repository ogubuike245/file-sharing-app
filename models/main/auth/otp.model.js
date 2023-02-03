const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
  },

  otp: { type: String },
  // createdAt: { type: Date, default: Date.now(), expires: 1300 },
  createdAt: { type: Date },
  expiresAt: { type: Date },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = { OTP };
