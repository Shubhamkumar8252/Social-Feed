const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createClient } = require("redis");

const redis = createClient();
redis.connect();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 2 * 1024 * 1024 }
});

router.post("/", upload.single("image"), async (req, res) => {
  const { content } = req.body;
  const username = req.headers.username || "celebrity";

  let imagePath = "";
  if (req.file) {
    const ext = path.extname(req.file.originalname);
    const newPath = `uploads/${req.file.filename}${ext}`;
    fs.renameSync(req.file.path, newPath);
    imagePath = `http://localhost:5000/${newPath}`;
  }

  const post = new Post({ author: username, content, image: imagePath });
  await post.save();

  await redis.publish("post_channel", JSON.stringify(post));
  res.json({ success: true });
});

router.get("/:author", async (req, res) => {
  const posts = await Post.find({ author: req.params.author }).sort({ createdAt: -1 });
  res.json(posts);
});

router.post("/feed", async (req, res) => {
  const { followedCelebrities, page = 1, limit = 5 } = req.body;

  const posts = await Post.find({ author: { $in: followedCelebrities } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json(posts);
});

router.get("/following", async (req, res) => {
  const { user, page = 1 } = req.query;
  const limit = 5;

  const requestingUser = await User.findOne({ username: user });
  if (!requestingUser) return res.status(404).json([]);

  const followedCelebs = requestingUser.following;
  const posts = await Post.find({ author: { $in: followedCelebs } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json(posts);
});

module.exports = router;
