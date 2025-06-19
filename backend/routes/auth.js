const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ username, password, role });
    await newUser.save();

    const token = jwt.sign({ username: newUser.username, role: newUser.role }, "secret");
    res.json({ token, username: newUser.username, role: newUser.role });
  } catch (err) {
    res.status(500).json({ error: "Server error during registration" });
  }
});

router.get("/user/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Login attempt:", username, password);

    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found in DB");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.password !== password) {
      console.log("Password mismatch: DB has", user.password, "but entered", password);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, "secret");
    console.log("Login success:", username);
    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});
 router.get("/celebrities", async (req, res) => {
  const celebs = await User.find({ role: "celebrity" }, "username");
  res.json(celebs);
});

module.exports = router;
