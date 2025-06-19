const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/socialfeed").then(async () => {
  const users = [
    { username: "celebrity1", password: "123456", role: "celebrity" },
    { username: "celebrity2", password: "123456", role: "celebrity" },
    { username: "public1", password: "123456", role: "public" },
    { username: "public2", password: "123456", role: "public" }
  ];

  await User.deleteMany({});
  await User.insertMany(users);
  console.log("Dummy users inserted");
  mongoose.disconnect();
});
