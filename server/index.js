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
const gameOptionsRelRouter = require("./routes/GameOptionsRel");

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

// Variáveis do jogo
const paddles = {
  left: { y: 0, height: 100 },
  right: { y: 0, height: 100 },
};

const ball = {
  x: 0,
  y: 0,
  radius: 10,
  speedX: 5,
  speedY: 5,
};

let leftScore = 0;
let rightScore = 0;

app.get("/users/:id", async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.profilePicture) {
      user.profilePicture = user.profilePicture.toString("base64");
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal Server Error");
  }
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("joinGameRoom", ({ userId }) => {
    let room;
    for (const r in rooms) {
      if (rooms[r].length < 2) {
        room = r;
        break;
      }
    }
    if (!room) {
      room = socket.id;
      rooms[room] = [];
    }

    const playerIndex = rooms[room].findIndex(
      (player) => player.userId === userId
    );
    if (playerIndex === -1) {
      socket.join(room);
      rooms[room].push({ userId, socketId: socket.id });

      io.to(room).emit(
        "playersInRoom",
        rooms[room].map((player) => player.userId)
      );

      if (rooms[room].length === 2) {
        const ball = {
          x: 0,
          y: 0,
          speedX: 5,
          speedY: 5,
        };
        const paddles = {
          left: { y: 0 },
          right: { y: 0 },
        };
        io.to(room).emit("gameInit", {
          ball,
          paddles,
          scores: { left: 0, right: 0 },
        });
      }
    }

    socket.on("playerMove", (data) => {
      io.to(room).emit("gameUpdate", {
        /*...*/
      });
    });
    
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      const index = rooms[room].findIndex(
        (player) => player.socketId === socket.id
      );
      if (index !== -1) {
        rooms[room].splice(index, 1);

        io.to(room).emit(
          "playersInRoom",
          rooms[room].map((player) => player.userId)
        );

        if (rooms[room].length === 0) {
          delete rooms[room];
        }
      }
    });
  });

  socket.on("message", async (data) => {
    try {
      const newMessage = await db.Message.create({
        text: data.text,
        UserId: data.user.id,
        topic: data.topic || "General",
      });

      const sender = await db.User.findByPk(data.user.id);
      if (sender) {
        const profilePictureBase64 = sender.profilePicture
          ? sender.profilePicture.toString("base64")
          : null;

        io.emit("message", {
          text: newMessage.text,
          sender: sender.username,
          profilePicture: profilePictureBase64,
          topic: data.topic
        });
      }
    } catch (error) {
      console.error("Error saving message to the database:", error);
    }
  });

  socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
  });

});

db.sequelize.sync().then(() => {
  server.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
