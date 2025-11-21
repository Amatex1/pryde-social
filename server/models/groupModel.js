const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chats",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

const Groups = mongoose.model("Groups", groupSchema);
module.exports = Groups;
