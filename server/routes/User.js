const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const { validationResult } = require("express-validator");

router.post("/", async (req, res) => {
  try {
    const { username, password, email, firstName, lastName, birthDate } =
      req.body;

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hash,
      email,
      firstName,
      lastName,
      birthDate,
    });

    res.json(newUser);
  } catch (error) {
    console.error("Erro ao criar o utilizador:", error);
    res.status(500).json({ error: "Erro ao criar o utilizador" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) res.json({ error: "User Doesn't Exist" });

    bcrypt.compare(password, user.password).then(async (match) => {
      if (!match)
        res.json({ error: "Wrong Username And Password Combination" });

      const accessToken = sign(
        { username: user.username, id: user.id },
        "importantsecret"
      );
      res.json({ token: accessToken, username: user.username, id: user.id });
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer o login" });
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const basicInfo = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!basicInfo) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(basicInfo);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ error: "Error fetching user data" });
  }
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong Password Entered!" });

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
      res.json("SUCCESS");
    });
  });
});

router.get("/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ where: { username: username } });

    const isUsernameAvailable = !user;

    res.json({ available: isUsernameAvailable });
  } catch (error) {
    console.error(
      "Erro ao verificar a disponibilidade do nome do utilizador:",
      error
    );
    res
      .status(500)
      .json({ error: "Erro ao verificar a disponibilidade do nome de utilizador" });
  }
});

module.exports = router;
