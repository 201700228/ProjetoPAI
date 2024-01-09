const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const db = require("./models");
db.Message = require("./models/Message")(db.sequelize, db.Sequelize);

const scoreRouter = require("./routes/Score");
const commentRouter = require("./routes/Comment");
const userRouter = require("./routes/User");
const leaderboardRouter = require("./routes/Leaderboard");
const tournamentRouter = require("./routes/Tournament");
const forumRouter = require("./routes/Forum");
const topicRouter = require("./routes/Topic");
const gameRouter = require("./routes/Game");
const commentTopicRouter = require("./routes/CommentTopic");
const userTournamentRouter = require("./routes/UserTournament");
const messageRouter = require("./routes/Message");

app.use("/scores", scoreRouter);
app.use("/comments", commentRouter);
app.use("/auth", userRouter);
app.use("/leaderboards", leaderboardRouter);
app.use("/tournaments", tournamentRouter);
app.use("/forums", forumRouter);
app.use("/topics", topicRouter);
app.use("/games", gameRouter);
app.use("/comment-topics", commentTopicRouter);
app.use("/user-tournaments", userTournamentRouter);
app.use("/messages", messageRouter);

// WebSocket logic
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("message", async (data) => {
    // Save the message to the database
    try {
      const newMessage = await db.Message.create({ text: data.text });
      io.emit("message", { text: data.text });

      // Send the saved message to the client if needed
      // io.emit("message", { text: newMessage.text });
    } catch (error) {
      console.error("Error saving message to the database:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

db.sequelize.sync().then(() => {
  server.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
