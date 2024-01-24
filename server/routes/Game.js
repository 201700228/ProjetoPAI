const express = require("express");
const router = express.Router();
const { Game } = require("../models");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: multer.memoryStorage(),
});

// Endpoint para criar um novo jogo
router.post("/add", upload.single("picture"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const newGame = {
      name,
      description,
    };

    if (req.file) {
      newGame.picture = req.file.buffer;
    }

    console.log(newGame);
    const gameCreated = await Game.create(newGame);
    res.status(201).json(gameCreated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create game" });
  }
});

// Endpoint para obter todos os jogos
router.get("/list", async (req, res) => {
  try {
    const games = await Game.findAll();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve games" });
  }
});

// Endpoint para obter um jogo específico por ID
router.get("/game/:gameId", async (req, res) => {
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

// Endpoint para apagar um jogo específico por ID
router.delete("/game/:gameId", async (req, res) => {
  const gameId = req.params.gameId;
  try {
    const game = await Game.findByPk(gameId);
    if (game) {
      await game.destroy();
      res.json({ message: "Game deleted successfully" });
    } else {
      res.status(404).json({ error: "Game not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not delete the game" });
  }
});

// Endpoint para atualizar um jogo específico por ID
router.put("/update/:gameId", upload.single("picture"), async (req, res) => {
  const gameId = req.params.gameId;
  const { name, description } = req.body;

  try {
    console.log(req.body);
    console.log(req.file);

    const game = await Game.findByPk(gameId);

    if (game) {
      game.name = name;
      game.description = description;

      if (req.file) {
        game.picture = req.file.buffer;
      } else {
        game.picture = null;
      }

      await game.save(); 

      res.json(game);
    } else {
      res.status(404).json({ error: "Game not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the game" });
  }
});

// Endpoint para obter jogos com o nome
router.get("/search", async (req, res) => {
  const { name } = req.query;
  try {
    const games = await Game.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve games" });
  }
});

module.exports = router;
