const uploader = require("../../utils/file_uploader");

const update_user_info = (req, res, next) => {
  const upload = uploader(
    "upload",
    ["image/jpeg", "image/jpg", "image/png"],
    10000000,
    "only .jpeg or .jpg or .png file alowed!"
  );

  upload.any()(req, res, (err) => {
    if (err) {
      next(err);
    } else {
      next();
    }
  });
};

module.exports = update_user_info;
