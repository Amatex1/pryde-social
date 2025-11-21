const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    text: {
      type: String,
      default: null,
    },

    image: {
      type: String, // GridFS filename
      default: null,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
        text: String,
        createdAt: Date,
      },
    ],
  },
  { timestamps: true }
);

const Posts = mongoose.model("Posts", postSchema);
module.exports = Posts;
