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
    console.log(req.body);

    const { GameId, GameOptionsId } = req.body;

    const newGameOptionsRel = await GameOptionsRel.create({
      gameId: GameId,
      gameOptionId: GameOptionsId,
    });

    res.json(newGameOptionsRel);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

// PUT (update) a specific GameOptionsRel record by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    /* your request body parameters */
  } = req.body;

  try {
    const gameOptionsRel = await db.GameOptionsRel.findByPk(id);

    if (gameOptionsRel) {
      await gameOptionsRel.update({
        /* your parameters */
      });
      res.json(gameOptionsRel);
    } else {
      res.status(404).send("GameOptionsRel not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
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
          attributes: ["id", "optionName"],
        },
      ],
    });

    if (gameOptions.length > 0) {
      // Agora você pode acessar diretamente os dados do GameOptions no resultado do join
      res.json(gameOptions);
    } else {
      res
        .status(404)
        .send("Nenhuma opção de jogo encontrada para o gameId fornecido.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno do servidor.");
  }
});

module.exports = router;
