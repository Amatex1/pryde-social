const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const path = require("path");
const connUrl = require("../dbConn");

const router = express.Router();

/* ------------------------------------
   CONNECT USING EXISTING MONGOOSE
------------------------------------- */
const connection = mongoose.connection;

let bucket;
connection.once("open", () => {
  bucket = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: "uploads",
  });
});

/* ------------------------------------
   MULTER GRIDFS STORAGE
------------------------------------- */
const storage = new GridFsStorage({
  url: connUrl,
  file: (req, file) => {
    const filename =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    return {
      filename,
      bucketName: "uploads",
    };
  },
});

const upload = multer({ storage });

/* ------------------------------------
   UPLOAD ROUTES
------------------------------------- */
router.post("/upload/chat", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename });
});

router.post("/upload/profile", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename });
});

router.post("/upload/cover", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename });
});

router.post("/upload/groupIcon", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename });
});

/* ------------------------------------
   DOWNLOAD / RETRIEVE FILE
------------------------------------- */
router.get("/retrieve/file/:name", async (req, res) => {
  try {
    const files = await connection.db
      .collection("uploads.files")
      .findOne({ filename: req.params.name });

    if (!files) return res.status(404).json({ error: "File not found" });

    const readStream = bucket.openDownloadStreamByName(req.params.name);
    readStream.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error reading file" });
  }
});

module.exports = router;
