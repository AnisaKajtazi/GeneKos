const User = require("../models/User");
const { Op, Sequelize } = require("sequelize");

class ClinicUserRepository {
  async findAll({ page = 1, limit = 10, search = "" }) {
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {
      is_active: true,
      role: "user",
    };

    if (search.trim()) {
      search = search.toLowerCase();
      whereClause[Op.or] = [
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("first_name")), "LIKE", `${search}%`),
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("last_name")), "LIKE", `${search}%`),
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("username")), "LIKE", `${search}%`),
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [["first_name", "ASC"]],
      attributes: [
        "id",
        "first_name",
        "last_name",
        "username",
        "email",
        "phone",
        "gender",
        "date_of_birth",
        "address",
        "is_active",
      ],
    });

    return { users: rows, page, totalPages: Math.ceil(count / limit), totalUsers: count };
  }

  async findById(id) {
    return User.findByPk(id);
  }

  async create(data) {
    return User.create(data);
  }

  async update(user, data) {
    return user.update(data);
  }

  async softDelete(user) {
    return user.update({ is_active: false });
  }
}

module.exports = new ClinicUserRepository();
