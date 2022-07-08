const { model, Schema } = require("mongoose");

const messageSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    participant: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    conversation_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = model("message", messageSchema);

module.exports = Message;
