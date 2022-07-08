const { model, Schema } = require("mongoose");

const conversationSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

const Conversation = model("conversation", conversationSchema);

module.exports = Conversation;
