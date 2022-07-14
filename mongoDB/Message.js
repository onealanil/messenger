const mongoose = require("mongoose");

const Message = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    msg: {
      type: String,
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", Message);

module.exports = MessageModel;
