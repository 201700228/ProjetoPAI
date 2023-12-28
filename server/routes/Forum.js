const express = require("express");
const router = express.Router();
const { Forum } = require("../models");

// Endpoint para criar um novo fórum
router.post("/forums", async (req, res) => {
  try {
    const newForum = await Forum.create(req.body);
    res.status(201).json(newForum);
  } catch (error) {
    res.status(500).json({ error: "Could not create forum" });
  }
});

// Endpoint para obter todos os fóruns
router.get("/forums", async (req, res) => {
  try {
    const forums = await Forum.findAll();
    res.json(forums);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve forums" });
  }
});

// Endpoint para obter um fórum específico por ID
router.get("/forums/:forumId", async (req, res) => {
  const forumId = req.params.forumId;
  try {
    const forum = await Forum.findByPk(forumId);
    if (forum) {
      res.json(forum);
    } else {
      res.status(404).json({ error: "Forum not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve the forum" });
  }
});

module.exports = router;