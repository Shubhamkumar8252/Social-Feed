const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ["celebrity", "public"] },
  followers: { type: [String], default: [] },
  following: { type: [String], default: [] }
})

module.exports = mongoose.model("User", userSchema)
