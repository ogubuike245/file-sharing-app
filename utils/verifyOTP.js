const { OTP } = require("../models/main/auth/otp.model");

const { verifyHashedData } = require("./hashData");

const verifyOTP = async ({ email, otp }) => {
  try {
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

    const hashedOTP = matchedOTPRecord.otp;
    // const validOTP = verifyHashedData(otp, hashedOTP);
    const validOTP = await bcrypt.compare(otp, hashedOTP);

    // send mail to show verified

    return validOTP;
  } catch (error) {
    throw error;
  }
};

module.exports = { verifyOTP };
