const express = require("express");
const router = express.Router();
const { Leaderboard } = require("../models");

// Endpoint para obter a leaderboard de um jogo específico
router.get("/:gameId", async (req, res) => {
  const gameId = req.params.gameId;
  try {
    const leaderboard = await Leaderboard.getLeaderboardByGameId(gameId);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve leaderboard" });
  }
});

// Endpoint para obter a posição do utilizador na leaderboard de um jogo específico
router.get("/user/:userId/:gameId", async (req, res) => {
  const { userId, gameId } = req.params;
  try {
    const userPosition = await Leaderboard.getUserPositionInGame(
      userId,
      gameId
    );
    res.json(userPosition);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not retrieve user position in leaderboard" });
  }
});

// Endpoint para adicionar um novo registo à leaderboard
router.post("/add", async (req, res) => {
  try {
    const result = req.body.result;
    const victory = req.body.victory;
    const dateTime = req.body.dateTime;
    const userId = req.body.userId;
    const gameId = req.body.gameId;

    const newLeaderboardEntry = await Leaderboard.create({
      result,
      victory,
      dateTime,
      userId,
      gameId,
    });

    res.json(newLeaderboardEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not add leaderboard entry" });
  }
});

module.exports = router;
