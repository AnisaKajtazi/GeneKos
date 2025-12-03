
const { Op, fn, col } = require("sequelize");
const User = require("../../domain/models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim serveri" });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Përdoruesi nuk u gjet" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim serveri" });
  }
};


exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, username, email, password, role, phone, gender, date_of_birth, address } = req.body;
    const newUser = await User.create({ first_name, last_name, username, email, password, role, phone, gender, date_of_birth, address });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim serveri" });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Përdoruesi nuk u gjet" });

    await user.update(req.body);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim serveri" });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Përdoruesi nuk u gjet" });

    await user.destroy();
    res.json({ message: "Përdoruesi u fshi me sukses" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim serveri" });
  }
};


exports.searchUsers = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) return res.status(400).json({ message: "Shkruaj termin e kërkimit" });

    const users = await User.findAll({
      where: {
        [Op.or]: [
          fn('LOWER', col('first_name')) = fn('LOWER', search),
          fn('LOWER', col('last_name')) = fn('LOWER', search),
          fn('LOWER', col('username')) = fn('LOWER', search)
        ],
      },
      attributes: ["id", "first_name", "last_name", "role"]
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim serveri" });
  }
};
