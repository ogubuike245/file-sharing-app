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
      service: process.env.HOTMAIL_HOST,
      auth: {
        user: process.env.HOTMAIL,
        pass: process.env.HOTMAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: process.env.HOTMAIL,
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

module.exports = {
  sendVerificationEmail,
  validateName,
  trimRequestBody,
  validateEmail,
};
