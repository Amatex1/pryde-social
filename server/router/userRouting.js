const express = require("express");
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/userModel.js";
import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import connUrl from "../dbConn.js";
import mongoose from "mongoose";
import Pusher from "pusher";

const router = express.Router();

/* -------------------------
   GRIDFS STORAGE
------------------------- */
const storage = new GridFsStorage({
  url: connUrl,
  file: (req, file) => {
    const folder =
      req.uploadType === "profile"
        ? "profilePhotos"
        : req.uploadType === "cover"
        ? "coverPhotos"
        : "uploads";

    return {
      bucketName: folder,
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

const upload = multer({ storage });

/* -------------------------
   AUTH HELPERS
------------------------- */
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ error: "Not authorized" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

/* -------------------------
   SIGNUP
------------------------- */
router.post("/signup", async (req, res) => {
  try {
    const exists = await Users.findOne({ email: req.body.email });
    if (exists)
      return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = await Users.create({
      email: req.body.email,
      password: hashed,
      fullname: req.body.fullname,
      nickname: req.body.nickname || "",
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      result: user,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* -------------------------
   LOGIN
------------------------- */
router.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });

    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match)
      return res.status(400).json({ error: "Invalid email or password" });

    const token = generateToken(user);

    res.json({
      token,
      result: user,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* -------------------------
   GET LOGGED-IN USER
------------------------- */
router.get("/user/me", auth, async (req, res) => {
  try {
    const user = await Users.findById(req.userId).lean();

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* -------------------------
   UPDATE PROFILE (TEXT FIELDS)
------------------------- */
router.post("/updateProfile", auth, async (req, res) => {
  try {
    const updates = {
      nickname: req.body.nickname,
      pronouns: req.body.pronouns,
      gender: req.body.gender,
      relationship: req.body.relationship,
      bio: req.body.bio,
      socials: req.body.socials,
    };

    const updated = await Users.findByIdAndUpdate(req.userId, updates, {
      new: true,
    }).lean();

    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* -------------------------
   UPLOAD PROFILE PHOTO
------------------------- */
router.post(
  "/upload/profile",
  (req, res, next) => {
    req.uploadType = "profile";
    next();
  },
  upload.single("image"),
  auth,
  async (req, res) => {
    try {
      const updated = await Users.findByIdAndUpdate(
        req.userId,
        { profilePhoto: req.file.filename },
        { new: true }
      );

      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

/* -------------------------
   UPLOAD COVER PHOTO
------------------------- */
router.post(
  "/upload/cover",
  (req, res, next) => {
    req.uploadType = "cover";
    next();
  },
  upload.single("image"),
  auth,
  async (req, res) => {
    try {
      const updated = await Users.findByIdAndUpdate(
        req.userId,
        { coverPhoto: req.file.filename },
        { new: true }
      );

      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

/* -------------------------
   SEARCH USERS
------------------------- */
router.get("/users/search", async (req, res) => {
  try {
    const rs = await Users.find({
      fullname: { $regex: req.query.q, $options: "i" },
    }).lean();

    res.json(rs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* -------------------------
   GET USER BY ID
------------------------- */
router.get("/users/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id).lean();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
/* -------------------------------------------------
      FRIEND SYSTEM — MUTUAL FRIEND MODEL
   ------------------------------------------------- */

import Users from "../models/userModel.js"; // ensure this import already exists

/* -------------------------
   SEND FRIEND REQUEST
--------------------------*/
router.post("/friends/request", auth, async (req, res) => {
  const { targetId } = req.body;
  const viewerId = req.userId;

  if (viewerId === targetId)
    return res.status(400).json({ error: "Cannot friend yourself" });

  try {
    const viewer = await Users.findById(viewerId);
    const target = await Users.findById(targetId);

    if (!viewer || !target)
      return res.status(404).json({ error: "User not found" });

    // Already friends?
    if (viewer.friends.includes(targetId))
      return res.status(400).json({ error: "Already friends" });

    // Already sent
    if (viewer.sentRequests.includes(targetId))
      return res.status(400).json({ error: "Request already sent" });

    // If they sent YOU a request, auto-accept
    if (viewer.receivedRequests.includes(targetId)) {
      viewer.receivedRequests.pull(targetId);
      target.sentRequests.pull(viewerId);

      viewer.friends.push(targetId);
      target.friends.push(viewerId);

      await viewer.save();
      await target.save();

      return res.json({ success: true, autoAccepted: true });
    }

    // Otherwise, send new request
    viewer.sentRequests.push(targetId);
    target.receivedRequests.push(viewerId);

    await viewer.save();
    await target.save();

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


/* -------------------------
   CANCEL SENT REQUEST
--------------------------*/
router.post("/friends/cancel", auth, async (req, res) => {
  const { targetId } = req.body;

  try {
    const viewer = await Users.findById(req.userId);
    const target = await Users.findById(targetId);

    viewer.sentRequests.pull(targetId);
    target.receivedRequests.pull(req.userId);

    await viewer.save();
    await target.save();

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


/* -------------------------
   ACCEPT REQUEST
--------------------------*/
router.post("/friends/accept", auth, async (req, res) => {
  const { targetId } = req.body;

  try {
    const viewer = await Users.findById(req.userId);
    const target = await Users.findById(targetId);

    viewer.receivedRequests.pull(targetId);
    target.sentRequests.pull(req.userId);

    viewer.friends.push(targetId);
    target.friends.push(req.userId);

    await viewer.save();
    await target.save();

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


/* -------------------------
   DECLINE REQUEST
--------------------------*/
router.post("/friends/decline", auth, async (req, res) => {
  const { targetId } = req.body;

  try {
    const viewer = await Users.findById(req.userId);
    const target = await Users.findById(targetId);

    viewer.receivedRequests.pull(targetId);
    target.sentRequests.pull(req.userId);

    await viewer.save();
    await target.save();

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


/* -------------------------
   REMOVE FRIEND
--------------------------*/
router.post("/friends/remove", auth, async (req, res) => {
  const { targetId } = req.body;

  try {
    const viewer = await Users.findById(req.userId);
    const target = await Users.findById(targetId);

    viewer.friends.pull(targetId);
    target.friends.pull(req.userId);

    await viewer.save();
    await target.save();

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


/* -------------------------
   GET FRIEND LIST
--------------------------*/
router.get("/friends/list/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id)
      .populate("friends", "fullname nickname profilePhoto")
      .lean();

    res.json(user.friends || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


/* -------------------------
   GET MUTUAL FRIENDS
--------------------------*/
router.get("/friends/mutual/:id", auth, async (req, res) => {
  try {
    const viewer = await Users.findById(req.userId);
    const target = await Users.findById(req.params.id);

    const mutual = viewer.friends.filter((id) =>
      target.friends.includes(id)
    );

    const populated = await Users.find({ _id: { $in: mutual } })
      .select("fullname nickname profilePhoto")
      .lean();

    res.json(populated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
