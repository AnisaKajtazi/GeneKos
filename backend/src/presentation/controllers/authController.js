const authService = require("../../services/authService");

exports.register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ message: "User u krijua me sukses!", user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(err.status || 500).json({ message: err.message || "Gabim në server" });
  }
};

exports.login = async (req, res) => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    res.json({ user, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};
