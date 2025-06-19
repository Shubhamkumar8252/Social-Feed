const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const { createClient } = require("redis")
const mongoose = require("mongoose")
const path = require("path")

const socketHandler = require("./sockets/socketHandler")
const authRoutes = require("./routes/auth")
const postRoutes = require("./routes/posts")
const followRoutes = require("./routes/follow")
const publicFeedRoutes = require("./routes/publicFeed")

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/follow", followRoutes)
app.use("/api/public", publicFeedRoutes)

mongoose.connect("mongodb://127.0.0.1:27017/socialfeed")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err))

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

const redisClient = createClient()
redisClient.connect()
  .then(() => console.log("Redis connected"))
  .catch(console.error)

io.on("connection", (socket) => {
  socketHandler(io, socket, redisClient)
})


const PORT = 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
