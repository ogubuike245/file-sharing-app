const nodemailer = require("nodemailer");

const { HOTMAIL, HOTMAIL_PASSWORD, HOTMAIL_HOST } = process.env;

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: HOTMAIL_HOST,
      auth: {
        user: HOTMAIL,
        pass: HOTMAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: HOTMAIL,
      to: email,
      subject: subject,
      html: html,
    });
    console.log("EMAIL SENT SUCCESSFULLY");
  } catch (error) {
    console.log("EMAIL NOT SENT", error);
    return error;
  }
};

module.exports = { sendEmail };
