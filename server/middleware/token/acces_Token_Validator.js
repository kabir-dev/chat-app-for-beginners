const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const acces_Token_Validator = async (req, res, next) => {
  try {
    const { authorization } = await req.headers;
    if (!authorization) {
      throw createError.BadRequest("Bearer token is required");
    }

    const token = authorization.split(" ")[1];
    if (!token) throw createError.BadRequest("Bearer token is required");

    const secret = process.env.ACCESS_TOKEN_SECRET;

    const varyfiToken = await jwt.verify(token, secret, (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return next(createError.Unauthorized("Token is invalid"));
        } else if (err.name === "TokenExpiredError") {
          return next(createError.Unauthorized("Token is expired"));
        } else {
          return next(createError.InternalServerError());
        }
      }
      if (payload) {
        req.userId = payload.aud;
      }
      req.token = token;
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = acces_Token_Validator;
