const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/celebrities", async (req, res) => {
  try {
    const celebrities = await User.find({ role: "celebrity" }, "username");
    res.json(celebrities);
  } catch {
    res.status(500).json({ error: "Error fetching celebrities" });
  }
});

router.post("/follow", async (req, res) => {
  const { follower, followee } = req.body;

  if (follower === followee) return res.status(400).json({ error: "Cannot follow yourself" });

  const followerUser = await User.findOne({ username: follower });
  const followeeUser = await User.findOne({ username: followee });

  if (!followerUser || !followeeUser || followeeUser.role !== "celebrity") {
    return res.status(404).json({ error: "User not found or not a celebrity" });
  }

  if (!followerUser.following.includes(followee)) {
    followerUser.following.push(followee);
    await followerUser.save();
  }

  if (!followeeUser.followers.includes(follower)) {
    followeeUser.followers.push(follower);
    await followeeUser.save();
  }

  res.json({ success: true });
});

module.exports = router;
