import express from "express";
import Messages from "../models/messagesModel.js";
import Chats from "../models/chatsModel.js";
import { pusher } from "../server.js";

const router = express.Router();

// SEND MESSAGE
router.post("/message", async (req, res) => {
  try {
    const message = await Messages.create({
      chatId: req.body.chatId,
      sender: req.body.sender,
      text: req.body.text || null,
      file: req.body.file || null,
      audio: req.body.audio || null,
    });

    // Update last message
    await Chats.findByIdAndUpdate(req.body.chatId, {
      lastMessage: message._id,
    });

    // Real-time
    pusher.trigger(
      `presence-chat-${req.body.chatId}`,
      "new-message",
      { message }
    );

    res.status(201).json(message);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET MESSAGES
router.get("/message/:chatId", async (req, res) => {
  try {
    const messages = await Messages.find({
      chatId: req.params.chatId,
    })
      .populate("sender", "fullname nickname profilePhoto")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

// MARK AS SEEN
router.post("/message/markSeen", async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    await Messages.updateMany(
      {
        chatId,
        sender: { $ne: userId },
        seenAt: null,
      },
      { seenAt: new Date() }
    );

    pusher.trigger(
      `presence-chat-${chatId}`,
      "seen-update",
      {}
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
});

// ADD REACTION
router.post("/message/react", async (req, res) => {
  try {
    const { messageId, userId, emoji } = req.body;

    const msg = await Messages.findById(messageId);

    const existing = msg.reactions.find(
      (r) => r.userId.toString() === userId
    );

    if (existing) {
      existing.emoji = emoji;
    } else {
      msg.reactions.push({ userId, emoji });
    }

    await msg.save();

    pusher.trigger(
      `presence-chat-${msg.chatId}`,
      "reaction-update",
      { messageId, reactions: msg.reactions }
    );

    res.json(msg);
  } catch (err) {
    res.status(500).send(err);
  }
});

// REMOVE REACTION
router.post("/message/react/remove", async (req, res) => {
  try {
    const { messageId, userId } = req.body;

    const msg = await Messages.findByIdAndUpdate(
      messageId,
      { $pull: { reactions: { userId } } },
      { new: true }
    );

    pusher.trigger(
      `presence-chat-${msg.chatId}`,
      "reaction-update",
      { messageId, reactions: msg.reactions }
    );

    res.json(msg);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
