const express = require("express");
const router = express.Router();

const userRoutes = require("./userRouting");
const chatsRoutes = require("./chatsRouting");
const messageRoutes = require("./messageRouting");
const imageRoutes = require("./imageRouting");

// Matches your frontend axios calls exactly:
router.use("/users", userRoutes);
router.use("/conversations", chatsRoutes);
router.use("/messages", messageRoutes);
router.use("/upload", imageRoutes);

module.exports = router;
