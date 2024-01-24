const express = require("express");
const router = express.Router();
const { GameOptionsRel } = require("../models");
const { GameOptions } = require("../models");

// GET all GameOptionsRel records
router.get("/", async (req, res) => {
  try {
    const gameOptionsRels = await GameOptionsRel.findAll();
    res.json(gameOptionsRels);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// GET a specific GameOptionsRel record by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const gameOptionsRel = await GameOptionsRel.findByPk(id);

    if (gameOptionsRel) {
      res.json(gameOptionsRel);
    } else {
      res.status(404).send("GameOptionsRel not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// POST a new GameOptionsRel record
router.post("/", async (req, res) => {
  try {
    const { GameId, GameOptionId } = req.body;

    const existingGameOptionsRel = await GameOptionsRel.findOne({
      where: {
        gameId: GameId,
        gameOptionId: GameOptionId,
      },
    });

    if (existingGameOptionsRel) {
      return res
        .status(400)
        .send("Duplicate record: This relationship already exists.");
    }

    // Se o registro não existir, cria um novo
    const newGameOptionsRel = await GameOptionsRel.create({
      gameId: GameId,
      gameOptionId: GameOptionId,
    });

    res.json(newGameOptionsRel);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

// DELETE a specific GameOptionsRel record by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const gameOptionsRel = await GameOptionsRel.findByPk(id);

    if (gameOptionsRel) {
      await gameOptionsRel.destroy();
      res.send("GameOptionsRel deleted successfully");
    } else {
      res.status(404).send("GameOptionsRel not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/game/:gameID", async (req, res) => {
  const { gameID } = req.params;

  try {
    const gameOptions = await GameOptionsRel.findAll({
      where: {
        GameId: gameID,
      },
      include: [
        {
          model: GameOptions,
          attributes: ["id", "name", "description"],
        },
      ],
    });

    if (gameOptions.length > 0) {
      res.json(gameOptions);
    } else {
      res.status(200).send([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno do servidor.");
  }
});

router.delete("/game/:gameID/option/:optionID", async (req, res) => {
  const { gameID, optionID } = req.params;

  try {
    const gameOptionsRel = await GameOptionsRel.findOne({
      where: {
        GameId: gameID,
        GameOptionId: optionID,
      },
    });

    if (gameOptionsRel) {
      await gameOptionsRel.destroy();
      res.send("GameOptionsRel deleted successfully");
    } else {
      res.status(404).send("GameOptionsRel not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
