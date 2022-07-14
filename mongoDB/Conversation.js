const mongoose = require("mongoose");

const Conversation = new mongoose.Schema({
  conversation: {
    type: Array,
  },
});

const ConversationModel = mongoose.model("conversation", Conversation);

module.exports = ConversationModel;
