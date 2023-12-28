const express = require("express");
const router = express.Router();
const { Score } = require("../models");

// Endpoint para criar um novo score
router.post("/scores", async (req, res) => {
    try {
      const newScore = await Score.create(req.body);
      res.status(201).json(newScore);
    } catch (error) {
      res.status(500).json({ error: "Could not create score" });
    }
  });
  
  // Endpoint para obter todos os scores
  router.get("/scores", async (req, res) => {
    try {
      const scores = await Score.findAll();
      res.json(scores);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve scores" });
    }
  });
  
  // Endpoint para obter os scores de um utilizador específico
  router.get("/scores/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
      const userScores = await Score.findAll({ where: { userId } });
      res.json(userScores);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve user scores" });
    }
  });
  
  module.exports = router;