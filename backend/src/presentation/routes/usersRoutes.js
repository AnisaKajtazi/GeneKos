const express = require("express");
const router = express.Router();
const authMiddleware = require("../../infrastructure/middleware/authMiddleware");
const User = require("../../domain/models/User");

router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("=== GET /api/users called ===");
    console.log("Decoded user from token:", req.user); 

    let users = [];
    if (req.user.role === "clinic") {
      users = await User.findAll({
        where: { role: "user" },
        attributes: ["id", "first_name", "last_name", "role"]
      });
      console.log("Users fetched from DB:", users.map(u => u.dataValues));
    }
    
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
