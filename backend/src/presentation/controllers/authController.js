const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const User = require("../../domain/models/User");

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, username, email, password, role, phone, gender, date_of_birth, address } = req.body;

    const existingUser = await User.findOne({
      where: { username } 
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username ose email ekziston!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      role: role || 'user', 
      phone: phone || null,
      gender: gender || null,
      date_of_birth: date_of_birth || null,
      address: address || null
    });

    res.status(201).json({ message: "User u krijua me sukses!", user });
  } catch (err) {
    console.log("Register error:", err);
    res.status(500).json({ message: "Gabim në server" });
  }
};



exports.login = async (req, res) => {
  console.log("Login attempt for user:", req.body.username); 
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ user, token });
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


