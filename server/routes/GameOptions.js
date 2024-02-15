const express = require("express");
const router = express.Router();
const { GameOptions } = require("../models");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: multer.memoryStorage(),
});

// Endpoint para criar uma nova opção de jogo
router.post("/add", upload.single("picture"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const newGameOption = {
      name,
      description,
    };

    if (req.file) {
      newGameOption.picture = req.file.buffer;
    }else{
      newGameOption.picture = null;
    }

    const gameOptionCreated = await GameOptions.create(newGameOption);
    res.status(201).json(gameOptionCreated);
  } catch (error) {
    res.status(500).json({ error: "Could not create game option" });
  }
});

// Endpoint para obter todas as opções de jogo
router.get("/list", async (req, res) => {
  try {
    const gameOptions = await GameOptions.findAll();
    res.json(gameOptions);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve game options" });
  }
});

// Endpoint para obter uma opção de jogo específica por ID
router.get("/option/:optionId", async (req, res) => {
  const optionId = req.params.optionId;
  try {
    const gameOption = await GameOptions.findByPk(optionId);
    if (gameOption) {
      res.json(gameOption);
    } else {
      res.status(404).json({ error: "Game option not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve the game option" });
  }
});

// Endpoint para apagar uma opção de jogo específica por ID
router.delete("/option/:optionId", async (req, res) => {
  const optionId = req.params.optionId;
  try {
    const gameOption = await GameOptions.findByPk(optionId);
    if (gameOption) {
      await gameOption.destroy();
      res.json({ message: "Game option deleted successfully" });
    } else {
      res.status(404).json({ error: "Game option not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not delete the game option" });
  }
});

// Endpoint para atualizar uma opção de jogo específica por ID
router.put("/update/:optionId", upload.single("picture"), async (req, res) => {
  const optionId = req.params.optionId;
  const { name, description, picture } = req.body;
  try {
    const gameOption = await GameOptions.findByPk(optionId);
    if (gameOption) {
      gameOption.name = name;
      gameOption.description = description;

      if (req.file) {
        gameOption.picture = req.file.buffer;
      } else{
        gameOption.picture = null;
      }

      await gameOption.save();
      res.json(gameOption);
    } else {
      res.status(404).json({ error: "Game option not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not update the game option" });
  }
});

// Endpoint para obter opções de jogo com o nome
router.get("/search", async (req, res) => {
  const { name } = req.query;
  try {
    const gameOptions = await GameOptions.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
    res.json(gameOptions);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve game options" });
  }
});

module.exports = router;
