const User = require("../models/User");

module.exports = (io, socket, redis) => {
  socket.on("register_user", async (username) => {
    socket.username = username;
    socket.join(username);
  });

  redis.subscribe("post_channel", async (message) => {
    const post = JSON.parse(message);
    const celebrity = post.author;
    const celebUser = await User.findOne({ username: celebrity });

    if (celebUser && celebUser.followers.length > 0) {
      celebUser.followers.forEach((follower) => {
        io.to(follower).emit("new_notification", post);
      });
    }
  });
};
