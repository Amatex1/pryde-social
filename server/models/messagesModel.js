const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  emoji: { type: String },
});

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chats",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    text: {
      type: String,
      default: null,
    },

    file: {
      type: String, // filename stored in GridFS
      default: null,
    },

    audio: {
      type: String, // filename stored in GridFS
      default: null,
    },

    reactions: [reactionSchema],

    deliveredAt: {
      type: Date,
      default: null,
    },

    seenAt: {
      type: Date,
      default: null,
    },

    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Messages = mongoose.model("Messages", messageSchema);
module.exports = Messages;
