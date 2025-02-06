const { default: mongoose } = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = mongoose.Schema({
  // Here we will have multiple participants
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  messages: [messageSchema],
});

const chatModel = new mongoose.model("Chat", chatSchema);

module.exports = chatModel;
