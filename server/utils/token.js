const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const signAccessToken = async (userId) => {
  try {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: process.env.EXPIRED_ACCESS_TOKEN,
      issuer: process.env.ISSUER,
      audience: userId,
    };

    const token = await jwt.sign(payload, secret, options);
    return token;
  } catch (error) {
    throw createError.InternalServerError();
  }
};
const signRfreshToken = async (userId) => {
  try {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: process.env.EXPIRED_REFRESH_TOKEN,
      issuer: process.env.ISSUER,
      audience: userId,
    };

    const token = await jwt.sign(payload, secret, options);
    return token;
  } catch (error) {
    throw createError.InternalServerError();
  }
};

module.exports = {
  signAccessToken,
  signRfreshToken,
};
