const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
      maxlength: 30,
      required: true,
    },
    email: {
      type: String,
      maxlength: 30,
      required: true,
    },
    password: {
      type: String,
      maxlength: 16,
      required: true,
    },
    profile_pic: {
      type: String,
      default: "default.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(this.password, salt);
      this.password = hashPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = model("user", userSchema);

module.exports = User;
