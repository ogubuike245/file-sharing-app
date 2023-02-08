const bcrypt = require("bcrypt");
const { response } = require("express");
const mongoose = require("mongoose");
const {
  validateEmail,
  sendVerificationEmail,
} = require("../../../controllers/main/auth/utils/auth.utils");
const Token = require("./token.model");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  courses: {
    type: String,
    enum: ["chemistry", "physics", "biology"],
  },
  selectedCourse: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  downloads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  marks: {
    type: Number,
    default: 0,
  },
});

// MONGOOSE STATIC METHOD TO LOG THE USER IN
userSchema.statics.authenticate = async function (email, password) {
  if (validateEmail(email)) {
    const user = await this.findOne({ email });

    console.log(user);
    // Check if the user exists
    if (!user) {
      console.log("User not found");
    }
    // Check if the user is verified
    if (!user.isVerified) {
      console.log("User not verified");

      // // Check if the user exists in the Token model and the Token has not expired
      const tokenModel = await Token.findOne({ user: user._id });
      if (!tokenModel) {
        console.log("Token has expired or is invalid.");
        getNewOTP(response, email);
      }
    }
    // Verify the password
    const isPasswordCorrect = bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log("Incorrect password");
    } else {
      return user;
    }

    console.log("incorrect Email Format");
  }
};

////////////////////////////
const User = mongoose.model("User", userSchema);

module.exports = User;

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function getNewOTP(response, email) {
  const user = await this.findOne({ email });
  console.log(user);
  if (!user) {
    return console.log("User not found");
  }
  if (!user.isVerified) {
    console.log("User not verified");
    // Check if the user exists in the Token model and the Token has not expired
    const tokenModel = await Token.findOne({ user: user._id });
    if (tokenModel) {
      await Token.deleteOne({ _id: tokenModel._id });
    }

    // GENERATE AND HASH THE OTP
    const generatedOTP = generateOTP();
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(generatedOTP, saltRounds);

    const token = new Token({
      value: hashedOtp,
      user: user._id,
    });
    await token.save();
    await sendVerificationEmail(user, generatedOTP);
    console.log(user, token);
    response.redirect(`/api/v1/auth/verify/${user.email}`);
  }
}
