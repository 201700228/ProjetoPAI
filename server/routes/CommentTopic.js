const express = require("express");
const router = express.Router();
const { Comment, Topic } = require("../models");

// Endpoint para criar um novo comentário em um tópico
router.post("/topics/:topicId/comments", async (req, res) => {
  const { topicId } = req.params;
  try {
    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const newComment = await Comment.create({ ...req.body, topicId });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Could not create comment" });
  }
});

// Endpoint para obter todos os comentários de um tópico
router.get("/topics/:topicId/comments", async (req, res) => {
  const { topicId } = req.params;
  try {
    const topicComments = await Comment.findAll({ where: { topicId } });
    res.json(topicComments);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve topic comments" });
  }
});

// Endpoint para obter um comentário específico em um tópico por ID
router.get("/topics/:topicId/comments/:commentId", async (req, res) => {
  const { topicId, commentId } = req.params;
  try {
    const comment = await Comment.findOne({ where: { id: commentId, topicId } });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found in this topic" });
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve the comment" });
  }
});

module.exports = router;
