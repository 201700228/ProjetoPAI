const express = require("express");
const router = express.Router();
const { Comment } = require("../models");

// Endpoint para criar um novo comentário
router.post("/comments", async (req, res) => {
  try {
    const newComment = await Comment.create(req.body);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Could not create comment" });
  }
});

// Endpoint para obter todos os comentários
router.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve comments" });
  }
});

// Endpoint para obter os comentários de um utilizador específico
router.get("/comments/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const userComments = await Comment.findAll({ where: { userId } });
    res.json(userComments);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve user comments" });
  }
});

module.exports = router;