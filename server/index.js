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
db.User = require("./models/User")(db.sequelize, db.Sequelize);
db.Message = require("./models/Message")(db.sequelize, db.Sequelize);

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
const gameOptionsRouter = require("./routes/GameOptions");
const gameOptionsRelRouter = require("./routes/GameOptionsRel")

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
app.use("/game-options", gameOptionsRouter);
app.use("/game-options-rel", gameOptionsRelRouter);


app.get("/users/:id", async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);
    user.profilePicture = user.profilePicture.toString('base64');
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// WebSocket logic
io.on("connection", (socket) => {
  // console.log("User connected");

  socket.on("message", async (data) => {
    // Save the message to the database
    try {
      const newMessage = await db.Message.create({
        text: data.text,
        UserId: data.user.id,
      });

      // Fetch the associated user data (username and profilePicture)
      const sender = await db.User.findByPk(data.user.id);
      console.log('sender.profilePicture', sender.profilePicture)
      if (sender) {
        const profilePictureBase64 = sender.profilePicture ? sender.profilePicture.toString('base64') : null;
        io.emit("message", {
          text: newMessage.text,
          sender: sender.username, // Access username directly
          profilePicture: profilePictureBase64,
        });

      } else {
        // console.error("Sender not found");
      }
    } catch (error) {
      console.error("Error saving message to the database:", error);
    }
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected");
  });
});

db.sequelize.sync().then(() => {
  server.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
