const express = require("express");
const router = express.Router();
const User = require("../../domain/models/User");

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: "user" }, 
      attributes: ["id", "first_name", "last_name", "email", "role"]
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
