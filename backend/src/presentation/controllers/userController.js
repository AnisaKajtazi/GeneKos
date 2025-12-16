const { Op, Sequelize } = require("sequelize");
const bcrypt = require('bcryptjs');
const User = require("../../domain/models/User");
const AuditLog = require("../../domain/models/AuditLog");

const createAuditLog = async ({ userId, username, role, action, entity, entityId, description }) => {
  try {
    await AuditLog.create({
      user_id: userId,
      username,
      role,
      action,
      entity,
      entity_id: entityId,
      description,
    });
  } catch (err) {
    console.error("Audit log error:", err);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '' } = req.query;

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereClause = { is_active: true };

    if (search && search.trim() !== '') {
      search = search.trim().toLowerCase();
      whereClause[Op.or] = [
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('first_name')), 'LIKE', `${search}%`),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('last_name')), 'LIKE', `${search}%`),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('username')), 'LIKE', `${search}%`),
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [['first_name', 'ASC']],
      attributes: [
        "id",
        "first_name",
        "last_name",
        "username",
        "role",
        "email",
        "phone",
        "gender",
        "date_of_birth",
        "address",
        "is_active"
      ]
    });

    res.json({
      users: rows || [],
      page,
      totalPages: Math.ceil(count / limit),
      totalUsers: count
    });
  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      role,
      phone,
      gender,
      date_of_birth,
      address,
      is_active: true
    });

   
    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "create",
        entity: "User",
        entityId: newUser.id,
        description: `U krijua përdoruesi ${newUser.username}`
      });
    }

    res.status(201).json(newUser);
  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ message: "Gabim serveri" });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Përdoruesi nuk u gjet" });

    if (req.body.password && req.body.password.trim() !== '') {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    } else {
      delete req.body.password;
    }

    await user.update(req.body);

    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "update",
        entity: "User",
        entityId: user.id,
        description: `U përditësua përdoruesi ${user.username}`
      });
    }

    res.json(user);
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({ message: "Gabim serveri" });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Përdoruesi nuk u gjet" });

    await user.update({ is_active: false });

    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        username: req.user.username,
        role: req.user.role,
        action: "delete",
        entity: "User",
        entityId: user.id,
        description: `U fshi përdoruesi ${user.username}`
      });
    }

    res.json({ message: "Përdoruesi u fshi me sukses (soft delete)" });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ message: "Gabim serveri" });
  }
};
