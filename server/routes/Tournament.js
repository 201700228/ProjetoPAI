const express = require("express");
const router = express.Router();
const { Tournament } = require("../models");

// Endpoint para criar um novo torneio
router.post("/tournaments", async (req, res) => {
  try {
    const newTournament = await Tournament.create(req.body);
    res.status(201).json(newTournament);
  } catch (error) {
    res.status(500).json({ error: "Could not create tournament" });
  }
});

// Endpoint para obter todos os torneios
router.get("/tournaments", async (req, res) => {
  try {
    const tournaments = await Tournament.findAll();
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve tournaments" });
  }
});

// Endpoint para obter um torneio específico por ID
router.get("/tournaments/:tournamentId", async (req, res) => {
  const tournamentId = req.params.tournamentId;
  try {
    const tournament = await Tournament.findByPk(tournamentId);
    if (tournament) {
      res.json(tournament);
    } else {
      res.status(404).json({ error: "Tournament not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve the tournament" });
  }
});

module.exports = router;
