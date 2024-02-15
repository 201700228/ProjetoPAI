const express = require("express");
const router = express.Router();
const { Leaderboard, User, Game, sequelize  } = require("../models");
const { Op } = require("sequelize");

// Endpoint para obter todas as leaderboards
router.get("/", async (req, res) => {
  try {
    const allLeaderboards = await Leaderboard.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Game,
          attributes: ["name"],
        },
      ],
      attributes: ["result", "dateTime"],
      where: {
        result: {
          [Op.gt]: 0, 
        },
      },
    });

    res.json(allLeaderboards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve all leaderboards" });
  }
});

// Endpoint para obter o número de vitórias de cada jogador em cada jogo
router.get("/victories", async (req, res) => {
  try {
    const victoriesByPlayerAndGame = await Leaderboard.findAll({
      attributes: [
        "userId",
        "gameId",
        [sequelize.fn("COUNT", sequelize.literal("CASE WHEN victory = true THEN 1 END")), "victories"],
      ],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Game,
          attributes: ["name"],
        },
      ],
      group: ["userId", "gameId", "User.username", "Game.name"], // Adicione os campos ao grupo
    });

    res.json(victoriesByPlayerAndGame);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve victories by player and game" });
  }
});


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

// Endpoint para obter as pontuções do utilizador na leaderboard de um jogo específico
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
