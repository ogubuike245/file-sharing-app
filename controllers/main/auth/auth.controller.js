const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../../models/main/auth/auth.model");
const Token = require("../../../models/main/auth/token.model");

const {
  sendVerificationEmail,
  validateName,
  validateEmail,
  trimRequestBody,
} = require("./utils/auth.utils");
//GET ALL THE UPLOADED DOCUMENTS IN THE DATABASE

module.exports.getAll = async (request, response) => {
  const user = await User.find();
  response.status(200).json(user);
};
module.exports.registerUser = async (request, response) => {
  try {
    let {
      email,
      password,
      firstName,
      lastName,
      registrationNumber,
      selectedCourse,
      phoneNumber,
    } = request.body;

    trimRequestBody(email, password, firstName, lastName);

    // Validate input
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !registrationNumber ||
      phoneNumber ||
      selectedCourse
    ) {
      throw new Error("Missing required fields");
    }

    if (!validateName(firstName) || !validateName(lastName)) {
      throw new Error("Invalid name entered");
    }

    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (password.length < 6) {
      throw new Error("Password is too short");
    }

    if (!User.schema.path("courses").enumValues.includes(selectedCourse)) {
      throw new Error("Invalid course selection");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Generate and hash the OTP
    const generatedOTP = generateOTP();
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(generatedOTP, saltRounds);

    // Hash password and save the user data along with the encrypted OTP in the database
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      firstName,
      lastName,
      email,
      registrationNumber,
      phoneNumber,
      selectedCourse,
      password: hashedPassword,
      isVerified: false,
    });

    const token = new Token({
      value: hashedOtp,
      user: user._id,
    });

    await user.save();
    await token.save();

    await sendVerificationEmail(user, generatedOTP);

    response.redirect(`/api/v1/auth/verify/${user.email}`);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports.verifyOTP = async (request, response) => {
  const { email, otp } = request.body;

  if (!email || !otp) {
    return console.log("EMPTY VALUES");
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return console.log("NO RECORD FOUND");
  }

  const existingToken = await Token.findOne({ user: existingUser._id });

  if (!existingToken) {
    return console.log("OTP NOT FOUND OR HAS EXPIRED");
  }

  const isValidOTP = await bcrypt.compare(otp, existingToken.value);

  if (!isValidOTP) {
    return console.log("INVALID OTP");
  }

  await User.updateOne(
    { _id: existingUser._id },
    { $set: { isVerified: true } }
  );
  response.redirect("/api/v1/auth/login");
  await Token.deleteOne({ _id: existingToken._id });
};

module.exports.reSendOTP = async (request, response) => {
  const { email } = request.body;
  getNewOTP(response, email);
};
module.exports.loginUser = async (request, response) => {
  const { email, password } = request.body;
  loginUser(email, password, response);
};

module.exports.userLogout = async (request, response) => {
  response.clearCookie("jwt");
  response.redirect("/");
};

//PASSWORD RESET

//CREATE NEW PASSWORD

// EDIT USER INFORMATION

/**
 * HELPER FUNCTIONS BELOW
 */

// LOG USER IN CUSTOM ASYNC FUNCTION
async function loginUser(email, password, response) {
  const user = await User.authenticate(email, password);
  if (!user) {
    return console.log("Incorrect email or password");
  }
  if (!user.isVerified) {
    await sendVerificationEmail(user, generateOTPAndSave(user._id));
    return response.redirect(`/api/v1/auth/verify/${user.email}`);
  }
  console.log("Login successful");
  response.cookie("jwt", createToken(user._id), {
    httpOnly: true,
    maximumAge: maximumAge * 1000,
  });
  response.redirect("/");
}

// GENERATE OTP AND SAVE TO TOKEN MODEL
async function generateOTPAndSave(userId) {
  const generatedOTP = generateOTP();
  await Token.deleteOne({ user: userId });
  const hashedOtp = await bcrypt.hash(generatedOTP, 10);
  const token = new Token({ value: hashedOtp, user: userId });
  await token.save();
  return generatedOTP;
}

// GET NEW OTP FUNCTION
async function getNewOTP(response, email) {
  const user = await this.findOne({ email });
  console.log(user);
  if (!user) {
    return console.log("User not found");
  }
  if (!user.isVerified) {
    console.log("User not verified");
    // Check if the user exists in the Token model and the Token has not expired
    const existingToken = await Token.findOne({ user: user._id });
    if (existingToken) {
      await Token.deleteOne({ _id: existingToken._id });
    }

    await sendVerificationEmail(user, generateOTPAndSave(user._id));
    console.log(user, token);
    response.redirect(`/api/v1/auth/verify/${user.email}`);
  }
}

// GENERATE OTP OF FOUR DIGITS
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// CREATE A JWT TOKEN
const maximumAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maximumAge,
  });
};
