const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  latestOtp: {
    type: String,
    required: false,
  },
  otpHistory: [
    {
      otp: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };

// // Generate OTP and save to user schema
// userSchema.methods.generateOTP = function () {
//   // Generate 6-digit random OTP
//   this.otp = Math.floor(100000 + Math.random() * 900000).toString();

//   // Save OTP to OTP history
//   this.otpHistory.push({ otp: this.otp });

//   // Save changes to the user schema
//   return this.save();
// };

// MONGOOSE PRE SAVE METHODS TO PERFORM A FUNCTION BEFORE DOCUMENT IS SAVED TO DATABASE
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// MONGOOSE STATIC METHOD TO LOG THE USER IN
userSchema.statics.login = async function (email, password) {
  if (isEmail(email)) {
    const user = await this.findOne({ email });
    if (user) {
      if (user.verified === false) {
        throw Error("not verified");
      }

      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error("incorrect password");
    }
    throw Error("Email Does Not Exist");
  } else {
    throw Error("incorrect Email Format");
  }
};
