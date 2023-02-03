const { OTP } = require("../models/main/auth/otp.model");
const generateOTP = require("./generateOtp");
const { hashData } = require("./hashData");
const { sendEmail } = require("./send.email");

const sendOTP = async ({ email, subject, message, duration = 1 }) => {
  try {
    if (!(email && subject && message)) {
      throw Error("EMPTY VALUES");
    }

    await OTP.deleteOne({ email });

    const generatedOTP = await generateOTP();

    sendEmail(
      email,
      subject,
      `<p> ${message}</p>
      
      <p>
    <b>${generatedOTP} /b>
    </p>
    
    <p>This code <b>expires in 
     ${duration} hour(s)</b>.</p>`
    );

    const hashedOTP = hashData(generatedOTP);

    const newOTP = await new OTP({
      email,
      hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 * +duration,
    });

    const createdOTPRecord = newOTP.save();
    return createdOTPRecord;
  } catch (error) {
    throw error;
  }
};

module.exports = { sendOTP };
