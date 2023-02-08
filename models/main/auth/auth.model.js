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
  phoneNumber: {
    type: Number,
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
  try {
    const user = await this.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    } else {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        throw new Error("Incorrect password");
      } else {
        return user;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

////////////////////////////
const User = mongoose.model("User", userSchema);

module.exports = User;
