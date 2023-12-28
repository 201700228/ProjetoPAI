const express = require("express");
const router = express.Router();
const { Leaderboard } = require("../models");

// Endpoint para obter a leaderboard de um jogo específico
router.get("/leaderboard/:gameId", async (req, res) => {
    const gameId = req.params.gameId;
    try {
      // Lógica para obter a leaderboard do jogo com o ID gameId
      const leaderboard = await Leaderboard.getLeaderboardByGameId(gameId);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve leaderboard" });
    }
  });

  // Endpoint para obter a posição do utilizador na leaderboard de um jogo específico
router.get("/leaderboard/user/:userId/:gameId", async (req, res) => {
    const { userId, gameId } = req.params;
    try {
      // Lógica para obter a posição do utilizador na leaderboard do jogo com o ID gameId
      const userPosition = await Leaderboard.getUserPositionInGame(userId, gameId);
      res.json(userPosition);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve user position in leaderboard" });
    }
  });

module.exports = router;