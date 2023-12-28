const express = require("express");
const router = express.Router();
const { Game } = require("../models");

// Endpoint para criar um novo jogo
router.post("/games", async (req, res) => {
  try {
    const newGame = await Game.create(req.body);
    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: "Could not create game" });
  }
});

// Endpoint para obter todos os jogos
router.get("/games", async (req, res) => {
  try {
    const games = await Game.findAll();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve games" });
  }
});

// Endpoint para obter um jogo específico por ID
router.get("/games/:gameId", async (req, res) => {
  const gameId = req.params.gameId;
  try {
    const game = await Game.findByPk(gameId);
    if (game) {
      res.json(game);
    } else {
      res.status(404).json({ error: "Game not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve the game" });
  }
});

module.exports = router;