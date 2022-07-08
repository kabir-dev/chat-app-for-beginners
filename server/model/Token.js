const { model, Schema } = require("mongoose");

const tokenSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Token = model("token", tokenSchema);

module.exports = Token;
