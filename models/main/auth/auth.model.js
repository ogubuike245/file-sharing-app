const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const isEmail = require("validator");

const authSchema = new mongoose.Schema(
  {
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

    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// MONGOOSE PRE SAVE METHODS TO PERFORM A FUNCTION BEFORE DOCUMENT IS SAVED TO DATABASE
authSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// MONGOOSE STATIC METHOD TO LOG THE USER IN
authSchema.statics.login = async function (email, password) {
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

const Auth = mongoose.model("auth", authSchema);

module.exports = Auth;

module.exports = { Auth };
