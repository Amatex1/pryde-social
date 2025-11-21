const express = require("express");
import Chats from "../models/chatsModel.js";
import Users from "../models/userModel.js";
import Messages from "../models/messagesModel.js";
import { pusher } from "../server.js";

const router = express.Router();

// CREATE A 1-on-1 CHAT
router.post("/chats/create", async (req, res) => {
  try {
    const { userId, otherUserId } = req.body;

    // Check for existing chat
    let existing = await Chats.findOne({
      isGroup: false,
      members: { $all: [userId, otherUserId], $size: 2 },
    });

    if (existing) return res.status(200).json(existing);

    const newChat = await Chats.create({
      isGroup: false,
      members: [userId, otherUserId],
    });

    res.status(201).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// CREATE GROUP CHAT
router.post("/chats/createGroup", async (req, res) => {
  try {
    const { name, members, adminId, icon } = req.body;

    const group = await Chats.create({
      isGroup: true,
      name,
      members,
      admins: [adminId],
      icon,
    });

    // System message
    await Messages.create({
      chatId: group._id,
      sender: adminId,
      text: `${name} was created`,
      isSystem: true,
    });

    res.status(201).json(group);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// ADD MEMBER
router.post("/chats/addMember", async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chats.findByIdAndUpdate(
      chatId,
      { $addToSet: { members: userId } },
      { new: true }
    );

    await Messages.create({
      chatId,
      isSystem: true,
      text: `A new member joined the group`,
    });

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).send(err);
  }
});

// REMOVE MEMBER
router.post("/chats/removeMember", async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chats.findByIdAndUpdate(
      chatId,
      { $pull: { members: userId } },
      { new: true }
    );

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).send(err);
  }
});

// RENAME GROUP
router.post("/chats/rename", async (req, res) => {
  try {
    const { chatId, name } = req.body;

    const chat = await Chats.findByIdAndUpdate(
      chatId,
      { name },
      { new: true }
    );

    await Messages.create({
      chatId,
      isSystem: true,
      text: `Group name changed to ${name}`,
    });

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).send(err);
  }
});

// PIN CHAT
router.post("/chats/pin", async (req, res) => {
  const { chatId, userId } = req.body;

  const updated = await Chats.findByIdAndUpdate(
    chatId,
    { $addToSet: { pinnedBy: userId } },
    { new: true }
  );

  res.json(updated);
});

// UNPIN CHAT
router.post("/chats/unpin", async (req, res) => {
  const { chatId, userId } = req.body;

  const updated = await Chats.findByIdAndUpdate(
    chatId,
    { $pull: { pinnedBy: userId } },
    { new: true }
  );

  res.json(updated);
});

// GET USER'S CHATS
router.get("/chats/my", async (req, res) => {
  try {
    const userId = req.query.userId;

    const chats = await Chats.find({
      members: { $in: [userId] },
    })
      .populate("members", "fullname nickname profilePhoto")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .lean();

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
