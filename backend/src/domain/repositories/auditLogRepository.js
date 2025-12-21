const AuditLog = require('../models/AuditLog');
const { Op, Sequelize } = require("sequelize");

class AuditLogRepository {
  async create(data) {
    return AuditLog.create(data);
  }

  async findAll({ page = 1, limit = 10, search = "" }) {
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereClause = { role: { [Op.in]: ["admin", "clinic"] } };

    if (search && search.trim() !== "") {
      search = search.trim().toLowerCase();
      whereClause[Op.and] = [
        {
          [Op.or]: [
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("username")), "LIKE", `%${search}%`),
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("role")), "LIKE", `%${search}%`),
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("action")), "LIKE", `%${search}%`),
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("entity")), "LIKE", `%${search}%`),
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("description")), "LIKE", `%${search}%`),
          ],
        },
      ];
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [["created_at", "DESC"]],
    });

    return { logs: rows || [], page, totalPages: Math.ceil(count / limit), totalLogs: count };
  }

  async findById(id) {
    return AuditLog.findByPk(id);
  }

  async delete(log) {
    return log.destroy();
  }
}

module.exports = new AuditLogRepository();
