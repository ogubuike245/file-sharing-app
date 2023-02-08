const nodemailer = require("nodemailer");

const validateEmail = (email) => {
  const request =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return request.test(email);
};
const validateName = (name) => {
  const request = /^[a-zA-z]*$/;
  return request.test(name);
};
const trimRequestBody = (
  email,
  password,
  firstName,
  lastName,
  registrationNumber
) => {
  email = email.trim();
  password = password.trim();
  firstName = firstName.trim();
  lastName = lastName.trim();
  registrationNumber = registrationNumber.trim();
};

const sendVerificationEmail = async (user, generatedOTP) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.GMAIL_HOST,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: process.env.GMAIL,
      to: user.email,
      subject: "Email Verification OTP",
      html: `<h1> Your OTP is ${generatedOTP} </h1>

    <a href="http://localhost:5000/api/v1/auth/verify/${user.email}">CLICK ON THIS LINK TO GO TO VERIFICATION PAGE</a>
    
    `,
    });
    console.log("EMAIL SENT SUCCESSFULLY");
  } catch (error) {
    console.log("EMAIL NOT SENT", error);
    return error;
  }
};
const sendVerificationSMS = async (user, generatedOTP) => {
  // Download the helper library from https://www.twilio.com/docs/node/install
  // Set environment variables for your credentials
  // Read more at http://twil.io/secure

  const accountSid = "ACdefd7493e2066b511d65c3504998d531";
  const authToken = "710e9afeb85f33e32dceec6519290b18";
  const client = require("twilio")(accountSid, authToken);
  try {
    const message = await client.messages.create({
      body: `Your OTP is ${generatedOTP}`,
      from: "+16089797363",
      // to: "+2349132782036",
      to: `${user.phoneNumber}`,
    });
    console.log(message.sid);
    console.log("SMS SENT SUCCESSFULLY");
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendVerificationEmail,
  validateName,
  trimRequestBody,
  validateEmail,
  sendVerificationSMS,
};
