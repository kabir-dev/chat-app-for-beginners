const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

const uploader = (folder, type, size, msg) => {
  const upload_path = `${__dirname}/../public/${folder}`;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, upload_path);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      // const fileName =
      //   file.originalname
      //     .replace(fileExt, "")
      //     .toLowerCase()
      //     .split(" ")
      //     .join("-") +
      //   "-" +
      //   Date.now();
      const fileName = Date.now();

      cb(null, fileName + fileExt);
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: size,
    },
    fileFilter: (req, file, cb) => {
      if (type.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError.BadRequest(msg));
      }
    },
  });

  return upload;
};

module.exports = uploader;
