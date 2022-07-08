const path = require("path");
const { unlink } = require("fs");
const createError = require("http-errors");
const { updateUserValidator } = require("../../utils/validator");

const update_user_validator = async (req, res, next) => {
  try {
    const { name } = req.body;
    const result = await updateUserValidator.validateAsync({ name });
    req.result = result;
    next();
  } catch (error) {
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(`${__dirname}/../../public/upload/${filename}`),
        (err) => {
          if (err) throw createError.InternalServerError();
        }
      );
    }
    if (error.isJoi) error.status = 422;
    next(error);
  }
};

module.exports = update_user_validator;
