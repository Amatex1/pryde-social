import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    fullname: { type: String, required: false },
    nickname: { type: String, default: "" },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    pronouns: { type: String, default: "" },
    gender: { type: String, default: "" },
    relationship: { type: String, default: "" },
    bio: { type: String, default: "" },

    socials: { type: [String], default: [] },

    profilePhoto: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },

    /* -----------------------------
       FRIEND SYSTEM (2-WAY)
    ------------------------------ */

    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users",
      default: [],
    },

    sentRequests: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users",
      default: [],
    },

    receivedRequests: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users",
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Users", userSchema);
