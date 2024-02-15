const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");

// Endpoint para adicionar um novo utilizador
router.post("/", upload.single("imageFile"), async (req, res) => {
  try {
    const { username, password, email, firstName, lastName, birthDate } =
      req.body;

    if (
      !username ||
      !password ||
      !email ||
      !firstName ||
      !lastName ||
      !birthDate
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const birth = new Date(birthDate);
    const today = new Date();
    const year = birth.getFullYear();

    let age = today.getFullYear() - year;
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    if (year.toString().length == 4 && age < 18) {
      return res
        .status(400)
        .json({ error: "User is younger than 18 years old." });
    } else if (
      year > today.getFullYear() ||
      year < 1900 ||
      year.toString().length > 4
    ) {
      return res.status(400).json({ error: "Invalid birth year." });
    }

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email is already in use." });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      password: hash,
      email,
      firstName,
      lastName,
      birthDate,
    };

    if (req.file) {
      newUser.profilePicture = req.file.buffer;
    }

    const createdUser = await User.create(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user." });
  }
});

// Endpoint para fazer login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ error: "User Doesn't Exist" });
    }

    bcrypt.compare(password, user.password).then(async (match) => {
      if (!match) {
        return res
          .status(401)
          .json({ error: "Wrong Username And Password Combination" });
      }

      const accessToken = sign(
        { username: user.username, id: user.id },
        "importantsecret"
      );
      return res.json({
        token: accessToken,
        username: user.username,
        id: user.id,
      });
    });
  } catch (error) {
    return res.status(500).json({ error: "Error while logging in" });
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

// Endpoint para mudar a password
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

// Endpoint para atualizar perfil do utilizador
router.put("/:id", upload.single("profilePicture"), async (req, res) => {
  const userId = req.params.id;
  const { username, email, firstName, lastName, birthDate } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!username || !email || !firstName || !lastName || !birthDate) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const birth = new Date(birthDate);
    const today = new Date();
    const year = birth.getFullYear();

    let age = today.getFullYear() - year;
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    if (year.toString().length == 4 && age < 18) {
      return res
        .status(400)
        .json({ error: "User is younger than 18 years old." });
    } else if (
      year > today.getFullYear() ||
      year < 1900 ||
      year.toString().length > 4
    ) {
      return res.status(400).json({ error: "Invalid birth year." });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.and]: [
          { [Op.not]: { id: userId } },
          { [Op.or]: [{ username }, { email }] },
        ],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email is already in use." });
    }

    user.username = username;
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.birthDate = birthDate;

    if (req.file) {
      user.profilePicture = req.file.buffer;
    }

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error updating user data" });
  }
});

// Endpoint para obter todos os utilizadores (sem fornecer password)
router.get("/all", async (req, res) => {
  try {
    const allUsers = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    return res.json(allUsers);
  } catch (error) {
    console.error("Error fetching all users:", error);
    return res.status(500).json({ error: "Error fetching all users" });
  }
});

module.exports = router;
