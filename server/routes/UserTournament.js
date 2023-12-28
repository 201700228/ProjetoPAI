const express = require("express");
const router = express.Router();
const { UserTournament } = require("../models");

// Endpoint para registrar a participação de um utilizador em um torneio
router.post("/user-tournaments", async (req, res) => {
  try {
    const newUserTournament = await UserTournament.create(req.body);
    res.status(201).json(newUserTournament);
  } catch (error) {
    res.status(500).json({ error: "Could not register user in tournament" });
  }
});

// Endpoint para obter todas as participações de um utilizador em torneios
router.get("/user-tournaments/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const userTournaments = await UserTournament.findAll({ where: { userId } });
    res.json(userTournaments);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve user's tournament participations" });
  }
});

// Endpoint para obter todas as participações em um torneio específico
router.get("/user-tournaments/tournament/:tournamentId", async (req, res) => {
  const { tournamentId } = req.params;
  try {
    const tournamentParticipants = await UserTournament.findAll({ where: { tournamentId } });
    res.json(tournamentParticipants);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve tournament participants" });
  }
});

module.exports = router;
