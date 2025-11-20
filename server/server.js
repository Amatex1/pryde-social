import express from "express";
import mongoose from "mongoose";
import Grid from "gridfs-stream";
import GridfsStorage from "multer-gridfs-storage";
import cors from "cors";
import bodyParser from "body-parser";
import Pusher from "pusher";
import dotenv from "dotenv";
import "./dbConn.js";
import connUrl from "./dbConn.js";
import path from "path";
import multer from "multer";

import Post from "./models/postModel.js";
import router from "./router/imageRouting.js";
import userRouter from "./router/userRouting.js";
import chatRouter from "./router/chatsRouting.js";
import messageRouter from "./router/messageRouting.js";

dotenv.config();

// ---- PUSHER INSTANCE ----
export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

// ---- EXPRESS SETUP ----
const app = express();
const port = process.env.PORT || 9000;

app.use(cors());
app.use(bodyParser.json());

// ---- PUSHER AUTH ROUTE (Presence Channels) ----
// IMPORTANT: attach your auth middleware here if needed
app.post("/pusher/auth", (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;

  // Fake user info — replace once you add JWT middleware
  const userData = {
    id: Date.now().toString(),
    user_info: {
      name: "User",
      avatar: null,
    },
  };
app.post("/pusher/auth", (req, res) => {
  const { socket_id, channel_name } = req.body;

  const userData = {
    id: Date.now(), // Replace with authenticated user ID later
    user_info: { name: "User" },
  };

  const auth = pusher.authenticate(socket_id, channel_name, userData);
  res.send(auth);
});

  const auth = pusher.authenticate(socketId, channel, userData);
  res.send(auth);
});

// ---- ROUTERS ----
app.use("/", router);
app.use("/", userRouter);
app.use("/", chatRouter);
app.use("/", messageRouter);

// ---- START SERVER ----
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
