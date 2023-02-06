const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
});

const User = mongoose.model("User", UserSchema);

const TokenSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expires: { type: Date, default: Date.now, expires: 3600 },
});

const Token = mongoose.model("Token", TokenSchema);

TokenSchema.methods.isExpired = function() {
  return Date.now() >= this.expires;
};

module.exports = {
  User,
  Token,
};

// MONGOOSE PRE SAVE METHODS TO PERFORM A FUNCTION BEFORE DOCUMENT IS SAVED TO DATABASE
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = bcrypt.hash(this.password, salt);
  next();
});

// MONGOOSE STATIC METHOD TO LOG THE USER IN
UserSchema.statics.login = async function (email, password) {
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
