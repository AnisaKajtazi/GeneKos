const userService = require("../../services/userService");

class UserController {
  async getAllUsers(req, res) {
    try {
      const { page, limit, search } = req.query;
      const result = await userService.getAllUsers({ page, limit, search });
      res.json(result);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: err.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ message: err.message });
    }
  }

  async createUser(req, res) {
    try {
      const newUser = await userService.createUser(req.body, req.user);
      res.status(201).json(newUser);
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ message: err.message });
    }
  }

  async updateUser(req, res) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body, req.user);
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      res.json(updatedUser);
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ message: err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const deleted = await userService.deleteUser(req.params.id, req.user);
      if (!deleted) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new UserController();
