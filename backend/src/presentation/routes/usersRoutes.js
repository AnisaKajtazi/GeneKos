const express = require("express");
const router = express.Router();
const authMiddleware = require("../../infrastructure/middleware/authMiddleware");
const { Op, fn, col, where } = require("sequelize");
const User = require("../../domain/models/User");

router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("=== GET /api/users called ===");
    console.log("Decoded user from token:", req.user);

    const { search } = req.query;
    let users = [];

    if (req.user.role === "clinic") {
      const whereClause = {
        role: "user",
        is_active: true,
      };

      if (search) {
        whereClause[Op.or] = [
          where(fn("LOWER", col("first_name")), "LIKE", `%${search.toLowerCase()}%`),
          where(fn("LOWER", col("last_name")), "LIKE", `%${search.toLowerCase()}%`),
          where(fn("LOWER", col("username")), "LIKE", `%${search.toLowerCase()}%`)
        ];
      }

      users = await User.findAll({
        where: whereClause,
        attributes: ["id", "first_name", "last_name", "role"],
      });

      console.log("Users fetched from DB:", users.map(u => u.dataValues));
    }

    res.json(users);
  } catch (err) {
    console.error("ERROR IN /users:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
