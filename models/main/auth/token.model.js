const mongoose = require("mongoose");
// const isEmail = require("validator");

const tokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    // validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  firstname: {
    type: String,
    required: [true, "Please enter your firstname"],
  },
  lastname: {
    type: String,
    required: [true, "Please enter your lastname"],
  },

  hash: { type: String, required: true },

  createdAt: { type: Date, default: Date.now(), expires: 1300 },
});
// },{timestamps: true});

const Token = mongoose.model("token", tokenSchema);

module.exports = { Token };
