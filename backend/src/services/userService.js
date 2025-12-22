const bcrypt = require("bcryptjs");
const { Op, Sequelize } = require("sequelize");

const userRepository = require("../domain/repositories/userRepository");
const auditLogService = require("./auditLogService");

class UserService {
  async getAllUsers({ page = 1, limit = 10, search = "" }) {
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereClause = { is_active: true };

    if (search.trim()) {
      search = search.toLowerCase();
      whereClause[Op.or] = [
        Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("first_name")),
          "LIKE",
          `${search}%`
        ),
        Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("last_name")),
          "LIKE",
          `${search}%`
        ),
        Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("username")),
          "LIKE",
          `${search}%`
        ),
      ];
    }

    const { count, rows } = await userRepository.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [["first_name", "ASC"]],
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
        "is_active",
      ],
    });

    return {
      users: rows,
      page,
      totalPages: Math.ceil(count / limit),
      totalUsers: count,
    };
  }

  async getUserById(id) {
    return userRepository.findById(id);
  }

  async createUser(data, currentUser) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await userRepository.create({
      ...data,
      password: hashedPassword,
      is_active: true,
    });

    await auditLogService.logAudit({
      user: currentUser,
      action: "create",
      entity: "User",
      entityId: newUser.id,
      description: `U krijua përdoruesi ${newUser.username}`,
    });

    return newUser;
  }

  async updateUser(id, data, currentUser) {
    if (data.password?.trim()) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      delete data.password;
    }

    const user = await userRepository.update(id, data);
    if (!user) return null;

    await auditLogService.logAudit({
      user: currentUser,
      action: "update",
      entity: "User",
      entityId: user.id,
      description: `U përditësua përdoruesi ${user.username}`,
    });

    return user;
  }

  async deleteUser(id, currentUser) {
    const user = await userRepository.update(id, { is_active: false });
    if (!user) return false;

    await auditLogService.logAudit({
      user: currentUser,
      action: "delete",
      entity: "User",
      entityId: user.id,
      description: `U fshi përdoruesi ${user.username}`,
    });

    return true;
  }
}

module.exports = new UserService();
