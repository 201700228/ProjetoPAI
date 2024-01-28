const express = require("express");
const router = express.Router();
const { Message } = require("../models");

router.get("/", async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: {
                topic: req.query.topic || "General",
            }
        });
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Error fetching messages" });
    }
});

router.get("/all", async (req, res) => {
    try {
        const topic = req.query.topic || "General";

        const messages = await Message.findAll({
          where: {
            topic: topic,
          },
        });
    
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Error fetching messages" });
    }
});


// Add more routes as needed, e.g., route to get messages for a specific user, etc.

module.exports = router;