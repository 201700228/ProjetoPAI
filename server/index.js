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


const userRouter = require("./routes/User");
const leaderboardRouter = require("./routes/Leaderboard");
const gameRouter = require("./routes/Game");
const messageRouter = require("./routes/Message");
const gameOptionsRouter = require("./routes/GameOptions");
const gameOptionsRelRouter = require("./routes/GameOptionsRel");

app.use("/auth", userRouter);
app.use("/leaderboards", leaderboardRouter);
app.use("/games", gameRouter);
app.use("/messages", messageRouter);
app.use("/game-options", gameOptionsRouter);
app.use("/game-options-rel", gameOptionsRelRouter);

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

let rooms = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", () => {
    console.log(rooms);

    let room;
    if (rooms.length > 0 && rooms[rooms.length - 1].players.length === 1) {
      room = rooms[rooms.length - 1];
    }

    if (room) {
      socket.join(room.id);
      socket.emit("playerNo", 2);

      // add player to room
      room.players.push({
        socketID: socket.id,
        playerNo: 2,
        score: 0,
        x: 690,
        y: 200,
      });

      // send message to room
      io.to(room.id).emit("startingGame", room);

      setTimeout(() => {
        io.to(room.id).emit("startedGame", room);

        // start game
        startGame(room);
      }, 3000);
    } else {
      room = {
        id: rooms.length + 1,
        players: [
          {
            socketID: socket.id,
            playerNo: 1,
            score: 0,
            x: 90,
            y: 200,
          },
        ],
        ball: {
          x: 395,
          y: 245,
          dx: Math.random() < 0.5 ? 1 : -1,
          dy: 0,
        },
        winner: 0,
      };
      rooms.push(room);
      socket.join(room.id);
      socket.emit("playerNo", 1);
    }
  });

  socket.on("move", (data) => {
    let room = rooms.find((room) => room.id === data.roomID);

    if (room) {
      if (data.direction === "up") {
        room.players[data.playerNo - 1].y -= 10;

        if (room.players[data.playerNo - 1].y < 0) {
          room.players[data.playerNo - 1].y = 0;
        }
      } else if (data.direction === "down") {
        room.players[data.playerNo - 1].y += 10;

        if (room.players[data.playerNo - 1].y > 440) {
          room.players[data.playerNo - 1].y = 440;
        }
      }
    }

    // update rooms
    rooms = rooms.map((r) => {
      if (r.id === room.id) {
        return room;
      } else {
        return r;
      }
    });

    io.to(room.id).emit("updateGame", room);
  });

  socket.on("leave", (roomID) => {
    socket.leave(roomID);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
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
          topic: data.topic,
          date: new Date(newMessage.createdAt).toLocaleString()
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

function startGame(room) {
  let interval = setInterval(() => {
    room.ball.x += room.ball.dx * 5;
    room.ball.y += room.ball.dy * 5;

    // check if ball hits player 1
    if (
      room.ball.x < 110 &&
      room.ball.y > room.players[0].y &&
      room.ball.y < room.players[0].y + 60
    ) {
      room.ball.dx = 1;

      // change ball direction
      if (room.ball.y < room.players[0].y + 30) {
        room.ball.dy = -1;
      } else if (room.ball.y > room.players[0].y + 30) {
        room.ball.dy = 1;
      } else {
        room.ball.dy = 0;
      }
    }

    // check if ball hits player 2
    if (
      room.ball.x > 690 &&
      room.ball.y > room.players[1].y &&
      room.ball.y < room.players[1].y + 60
    ) {
      room.ball.dx = -1;

      // change ball direction
      if (room.ball.y < room.players[1].y + 30) {
        room.ball.dy = -1;
      } else if (room.ball.y > room.players[1].y + 30) {
        room.ball.dy = 1;
      } else {
        room.ball.dy = 0;
      }
    }

    // up and down walls
    if (room.ball.y < 5 || room.ball.y > 490) {
      room.ball.dy *= -1;
    }

    // left and right walls
    if (room.ball.x < 5) {
      room.players[1].score += 1;
      room.ball.x = 395;
      room.ball.y = 245;
      room.ball.dx = 1;
      room.ball.dy = 0;
    }

    if (room.ball.x > 795) {
      room.players[0].score += 1;
      room.ball.x = 395;
      room.ball.y = 245;
      room.ball.dx = -1;
      room.ball.dy = 0;
    }

    if (room.players[0].score === 7) {
      room.winner = 1;
      rooms = rooms.filter((r) => r.id !== room.id);
      io.to(room.id).emit("endGame", room);
      clearInterval(interval);
    }

    if (room.players[1].score === 7) {
      room.winner = 2;
      rooms = rooms.filter((r) => r.id !== room.id);
      io.to(room.id).emit("endGame", room);
      clearInterval(interval);
    }

    io.to(room.id).emit("updateGame", room);
  }, 1000 / 60);
};

db.sequelize.sync().then(() => {
  server.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
