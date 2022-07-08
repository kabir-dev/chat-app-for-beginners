const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { bearerTokenValidator } = require("../../utils/validator");

const ref_Token_Validator = async (req, res, next) => {
  try {
    const { refresh_token } = await bearerTokenValidator.validateAsync(
      req.body
    );
    const token = refresh_token.split(" ")[1];
    if (!token) throw createError.BadRequest("Bearer token is required");

    const secret = process.env.REFRESH_TOKEN_SECRET;

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
    if (error.isJoi === true) error.status === 422;
    next(error);
  }
};

module.exports = ref_Token_Validator;
