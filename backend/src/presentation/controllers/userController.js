const userService = require("../../services/userService");

exports.getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers(req.query);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim serveri" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Përdoruesi nuk u gjet" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Gabim serveri" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body, req.user);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim serveri" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(
      req.params.id,
      req.body,
      req.user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Përdoruesi nuk u gjet" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Gabim serveri" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const success = await userService.deleteUser(req.params.id, req.user);
    if (!success) {
      return res.status(404).json({ message: "Përdoruesi nuk u gjet" });
    }
    res.json({ message: "Përdoruesi u fshi me sukses (soft delete)" });
  } catch (err) {
    res.status(500).json({ message: "Gabim serveri" });
  }
};
