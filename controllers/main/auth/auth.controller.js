const { User } = require("../../../models/main/auth/auth.model");
const { OTP } = require("../../../models/main/auth/otp.model");
const { hashData, verifyHashedData } = require("../../../utils/hashData");
const { handleErrors } = require("../../../utils/error.handling");
const { sendEmail } = require("../../../utils/send.email");
const crypto = require("crypto");
const emailTemplate = require("../../../utils/email.template");
const { sendOTP } = require("../../../utils/sendOTP");
const { verifyOTP } = require("../../../utils/verifyOTP");
const bcrypt = require("bcrypt");
//GET ALL THE UPLOADED DOCUMENTS IN THE DATABASE

module.exports.registerUser = async (req, res) => {
  let { email, password, firstName, lastName, registrationNumber } = req.body;

  email = email.trim();
  password = password.trim();
  firstName = firstName.trim();
  lastName = lastName.trim();
  registrationNumber = registrationNumber.trim();

  const existing_userModel_user = await User.findOne({ email: email });

  if (!(email && password && firstName && lastName && registrationNumber)) {
    throw Error("empty input fields");
  } else if (!validateName(firstName)) {
    throw Error("Invalid firstname entered");
  } else if (!validateName(lastName)) {
    throw Error("Invalid lastname entered");
  } else if (!validateEmail(email)) {
    throw Error("invalid email format  entered");
  } else if (password.length < 6) {
    throw Error("password is short");
  } else if (existing_userModel_user.latestOtp === null) {
    throw Error("EMAIL EXIST AND VERIFIED ");
  } else if (existing_userModel_user.latestOtp) {
    throw Error("EXIST BUT NOT VERIFIED");
  } else if (existing_userModel_user) {
    res.status(400).json({ message: "EMAIL ALREADY EXIST" });
  } else {
    try {
      // GENERATE AND HASH THE OTP
      const generatedOTP = generateOTP();
      const saltRounds = 10;
      const hashedOtp = await bcrypt.hash(generatedOTP, saltRounds);

      console.log(generatedOTP);

      // SEND AN EMAIL TO THE USER WITH THE OTP INFO

      const URL = `http://localhost:5000/api/v1/auth/verify/${email}/${hashedOtp}/`;
      // const URL = `/api/v1/auth/verify/${created_token_model._id}/${created_token}`;

      //STORE THE USER DATA ALONG WITH THE ENCRYPTED OTP IN THE DATABASE
      const ONE_HOUR = 60 * 60 * 1000;
      const user = new User({
        firstName,
        lastName,
        email,
        password,
        registrationNumber,
        isVerified: false,
        latestOtp: hashedOtp,
      });

      user.otpHistory.push({
        otp: hashedOtp,
      });
      await user.save();

      await sendEmail(
        email,
        "Verification OTP",
        `Your OTP is: ${generatedOTP}`
      );
      console.log(user);

      res
        .status(200)
        .json({ message: "VERIFICATION EMAIL SENT, PLEASE CHECK YOUR INBOX" });
    } catch (error) {
      // ERROR HANDLERS
      const errors = handleErrors(error);
      res.status(400).json(error);
    }
  }
};

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

module.exports.requestOTP = async (req, res) => {
  try {
    const { email, subject, message, duration } = req.body;

    if (!(email && subject && message)) {
      throw Error("EMPTY VALUES");
    }

    await OTP.deleteOne({ email });
    const generatedOTP = await generateOTP();

    console.log(generatedOTP);

    sendEmail(
      email,
      subject,
      `<p> ${message}</p>

      <p>
    ${generatedOTP} 
    </p>

    <p>This code <b>expires in
     ${duration} hour(s)</p>`
    );

    const hashedOTP = await bcrypt.hash(generatedOTP, 10);

    const newOTP = await new OTP({
      email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 * +duration,
    });

    console.log(newOTP);

    const createdOTPRecord = newOTP.save();

    res.status(200).json(createdOTPRecord);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.verifyOTP = async (req, res) => {
  try {
    // GET VALUES FROM REQUEST BODT
    const { email, otp } = req.body;

    // VERIFY IF THE VALUES EXIST
    if (!(email && otp)) {
      throw Error("EMPTY VALUES");
    }

    // CHECK IF THE USER EXISTS
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw Error("NO RECORD FOUND");
    }

    if (
      !existingUser.latestOtp ||
      existingUser.latestOtp.validUntil < Date.now()
    ) {
      throw new Error("OTP has expired");
    }

    // CHECK IF THE OTP ENTERED IS CORRECT
    const validOTP = await bcrypt.compare(req.body.otp, existingUser.latestOtp);
    if (!validOTP) {
      throw Error("INVALID OTP ENTERED");
    } else {
      existingUser.isVerified = true;
      existingUser.latestOtp = null;
      console.log(existingUser);
      res.status(200).json(validOTP);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.loginUser = async (req, res) => {
  res.render("pages/auth/login", {
    title: "Login",
  });
};
module.exports.verifyUser = async (req, res) => {
  res.render("pages/auth/verify", {
    title: "Verify",
  });
};

// EDIT A DOCUMENT PAGE

// EDIT A DOCUMENT

// DELETE A DOCUMENT

//

function validateEmail(email) {
  const request =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return request.test(email);
}
function validateName(name) {
  const request = /^[a-zA-z]*$/;
  return request.test(name);
}
