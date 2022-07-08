const createError = require("http-errors");

const notFound = (req, res, next) => {
  next(createError.NotFound());
};
const errorHandlear = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
};

module.exports = { notFound, errorHandlear };
