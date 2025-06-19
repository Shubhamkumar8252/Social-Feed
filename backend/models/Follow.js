const express = require("express")
const router = express.Router()
const Follow = require("../models/Follow")
const Post = require("../models/Post")

router.post("/follow", async (req, res) => {
  const { publicUser, celebrity } = req.body
  const exists = await Follow.findOne({ publicUser, celebrity })
  if (!exists) {
    await Follow.create({ publicUser, celebrity })
  }
  res.json({ success: true })
})

router.get("/feed/:publicUser", async (req, res) => {
  const follows = await Follow.find({ publicUser: req.params.publicUser })
  const celebrities = follows.map(f => f.celebrity)
  const posts = await Post.find({ author: { $in: celebrities } }).sort({ _id: -1 }).limit(20)
  res.json(posts)
})

module.exports = router
