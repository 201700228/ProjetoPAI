const express = require("express");
const router = express.Router();
const { Topic } = require("../models");

// Endpoint para criar um novo tópico
router.post("/topics", async (req, res) => {
  try {
    const newTopic = await Topic.create(req.body);
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(500).json({ error: "Could not create topic" });
  }
});

// Endpoint para obter todos os tópicos
router.get("/topics", async (req, res) => {
  try {
    const topics = await Topic.findAll();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve topics" });
  }
});

// Endpoint para obter os tópicos de um utilizador específico
router.get("/topics/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const userTopics = await Topic.findAll({ where: { userId } });
    res.json(userTopics);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve user topics" });
  }
});

module.exports = router;