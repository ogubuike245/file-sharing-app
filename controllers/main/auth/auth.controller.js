const bcrypt = require("bcrypt");
const crypto = require("crypto");

const { User, Token } = require("../../../models/main/auth/auth.model");
const { handleErrors } = require("../../../utils/error.handling");
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
  let {
    email,
    password,
    firstName,
    lastName,
    registrationNumber,
    selectedCourse,
  } = request.body;

  try {
    // REMOVE WHITESPACE WITH CUSTOM TRIM FUNCTION
    trimRequestBody(
      email,
      password,
      firstName,
      lastName,
      registrationNumber,
      selectedCourse
    );
    const existing_userModel_user = await User.findOne({ email: email });

    if (!(email && password && firstName && lastName && registrationNumber))
      console.log("empty input fields");
    if (!validateName(firstName && lastName))
      console.log("Invalid Name Entered");
    if (!validateEmail(email)) console.log("invalid email format ");
    if (password.length < 6) console.log("password is too short");

    if (!User.schema.path("courses").enumValues.includes(selectedCourse)) {
      console.log("Invalid course selection");
    }
    if (existing_userModel_user) {
      console.log({ message: "EMAIL ALREADY EXIST" });
    }
    // GENERATE AND HASH THE OTP
    const generatedOTP = generateOTP();
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(generatedOTP, saltRounds);

    //STORE THE USER DATA ALONG WITH THE ENCRYPTED OTP IN THE DATABASE

    const user = new User({
      firstName,
      lastName,
      email,
      registrationNumber,
      selectedCourse,
      password,
      isVerified: false,
    });
    const token = new Token({
      value: hashedOtp,
      user: user._id,
    });

    await user.save();
    await token.save();

    await sendVerificationEmail(user, generatedOTP);
    console.log(user, token);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

module.exports.verifyOTP = async (request, response) => {
  try {
    // GET VALUES FROM REQUEST BODT
    const { email, otp } = request.body;

    // VERIFY IF THE VALUES EXIST
    if (!(email && otp)) {
      console.log("EMPTY VALUES");
    }

    // CHECK IF THE USER EXISTS
    const existingUser = await User.findOne({ email });
    const existingToken = await Token.findOne({
      user: existingUser._id,
    });
    console.log(existingUser._id);
    console.log(existingToken);

    if (!existingUser) {
      console.log("NO RECORD FOUND");
    }

    if (!existingToken) {
      console.log("OTP NOT FOUND OR HAS EXPIRED");
    }

    // CHECK IF THE OTP ENTERED IS CORRECT
    const validOTP = await bcrypt.compare(
      request.body.otp,
      existingToken.value
    );
    if (!validOTP) {
      console.log("INAVLID OTP");
    }

    await User.updateOne(
      { _id: existingUser._id },
      { $set: { isVerified: true } }
    );

    await Token.deleteOne({ _id: existingToken._id });

    console.log(existingUser);

    response.redirect("/api/v1/auth/login");
  } catch (error) {
    response.status(400).send(error.message);
  }
};

module.exports.loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    // Find the user with the given email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      throw new Error("User not found");
    }

    // Verify the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Incorrect password");
    }

    // Check if the user is verified
    if (!user.isVerified) {
      throw new Error("User not verified");
    }

    // Check if the user exists in the Token model and the Token has not expired
    const tokenModel = await Token.findOne({ user: user._id });
    if (!tokenModel || tokenModel.isExpired) {
      return res.status(400).send("Token has expired or is invalid.");
    }

    //TODO: CHECK IF THE USER EMAIL EXISTS BUT HAS NOT BEEN VERIFIED AND IN THIS CASE A NEW TOKEN WILL BE SENT TO THE USER

    const token = createToken(user._id);
    response.cookie("jwt", token, {
      httpOnly: true,
      maximumAge: maximumAge * 1000,
    });
    response.status(200).json({
      user: user._id,
    });
  } catch (error) {
    // ERROR HANDLERS
    response.status(400).json(error);
  }
};

module.exports.userLogout = async (request, response) => {
  response.cookie("jwt", "", { maximumAge: 1 });
  response.redirect("/");
};

const maximumAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: maximumAge,
  });
};

// EDIT A DOCUMENT PAGE

// EDIT A DOCUMENT

// DELETE A DOCUMENT

//
