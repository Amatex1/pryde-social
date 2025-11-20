import express from "express";
import mongoose from "mongoose";
import Grid from "gridfs-stream";
import GridfsStorage from "multer-gridfs-storage";
import connUrl from "../dbConn.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Connection
const conn = mongoose.createConnection(connUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

const storage = new GridfsStorage({
  url: connUrl,
  file: (req, file) => {
    const filename =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);

    return { filename, bucketName: "uploads" };
  },
});

const upload = multer({ storage });

// CHAT ATTACHMENT
router.post("/upload/chat", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename });
});

// PROFILE PHOTO
router.post("/upload/profile", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename });
});

// COVER PHOTO
router.post("/upload/cover", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename });
});

// GROUP ICON
router.post("/upload/groupIcon", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename });
});

// SERVE FILE
router.get("/retrieve/file/:name", (req, res) => {
  gfs.files.findOne({ filename: req.params.name }, (err, file) => {
    if (!file) return res.status(404).send("Not found");

    const read = gfs.createReadStream(file.filename);
    read.pipe(res);
  });
});

export default router;
