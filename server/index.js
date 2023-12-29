const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
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

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});