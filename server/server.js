const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- CORS ----------
app.use(
  cors({
    origin: [
      "https://prydeapp.com",
      "https://www.prydeapp.com",
    ],
    credentials: true,
  })
);

// ---------- DATABASE ----------
const connectDB = require("./dbConn");
connectDB();

// ---------- ROUTES ----------
const router = require("./router");
app.use("/", router); // mounts users/, messages/, conversations/, upload/

// ---------- PUSHER REALTIME ----------
require("./pusher-realtime");

// ---------- ROOT CHECK ----------
app.get("/", (req, res) => {
  res.json({ status: "Pryde API running" });
});

// ---------- SERVER LISTEN ----------
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
