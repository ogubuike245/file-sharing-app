const jwt = require("jsonwebtoken");

const createToken = async (
  tokenData,
  tokenKey = process.env.TOKEN_KEY,
  expiresIn = process.env.TOKEN_EXPIRY
) => {
  try {
    const token = await jwt.sign(tokenData, tokenKey, {
      expiresIn,
    });
    return token;
  } catch (error) {
    throw error;
  }
};

module.exports = { createToken };
