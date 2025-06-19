const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Post = require("../models/Post")

router.get("/feed/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
  if (!user) return res.status(404).json({ error: "User not found" })

  const posts = await Post.find({ author: { $in: user.following } }).sort({ _id: -1 })
  res.json(posts)
})

module.exports = router
