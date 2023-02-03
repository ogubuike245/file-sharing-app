const { Auth } = require("../../../models/main/auth/auth.model");
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
  let { email, password, firstname, lastname } = req.body;
  console.log(req.body);
  email = email.trim();
  password = password.trim();
  firstname = firstname.trim();
  lastname = lastname.trim();

  const existing_authModel_user = await Auth.findOne({ email: email });
  const existing_tokenModel_user = await Token.findOne({ email: email });

  if (!(email && password && firstname && lastname)) {
    throw Error("empty input fields");
  } else if (!validateName(firstname)) {
    throw Error("Invalid firstname entered");
  } else if (!validateName(lastname)) {
    throw Error("Invalid lastname entered");
  } else if (!validateEmail(email)) {
    throw Error("invalid email format  entered");
  } else if (password.length < 6) {
    throw Error("password is short");
  } else if (existing_authModel_user || existing_tokenModel_user) {
    res.status(400).json({ message: "EMAIL ALREADY EXIST" });
  } else {
    try {
      const created_token = crypto.randomBytes(32).toString("hex");
      const hashed_token = await hashData(created_token, 10);
      const created_token_model = await Token.create({
        email,
        password,
        firstname,
        lastname,
        hash: hashed_token,
      });

      const URL = `/api/v1/auth/verify/${created_token_model._id}/${created_token}`;

      await sendEmail(
        email,
        `PLEASE ${created_token_model.firstname}  - VERIFY YOUR ACCOUNT`,
        emailTemplate(created_token_model.email, URL)
      );
      res
        .status(200)
        .json({ message: "VERIFICATION EMAIL SENT, PLEASE CHECK YOUR INBOX" });
    } catch (error) {
      // ERROR HANDLERS
      const errors = handleErrors(error);
      res.status(400).json({ errors });
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
    const { email, otp } = req.body;

    if (!(email && otp)) {
      throw Error("EMPTY VALUES");
    }
    const matchedOTPRecord = await OTP.findOne({ email });

    if (!matchedOTPRecord) {
      throw Error("NO RECORD FOUND");
    }
    const { expiresAt } = matchedOTPRecord;

    if (expiresAt < Date.now()) {
      await OTP.deleteOne({ email });
      throw Error("CODE EXPIRED , REQUEST NEW ONE");
    }
    const validOTP = await bcrypt.compare(req.body.otp, matchedOTPRecord.otp);
    res.status(200).json(validOTP);
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
