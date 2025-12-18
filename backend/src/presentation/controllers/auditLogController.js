const { Op, Sequelize } = require("sequelize");
const AuditLog = require('../../domain/models/AuditLog');

exports.getAllAuditLogs = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '' } = req.query;

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (req.user.role === "admin") {
      whereClause.role = { [Op.in]: ["admin", "clinic"] };
    } else {
      return res.status(403).json({ message: "Nuk keni qasje në audit logs" });
    }

    if (search && search.trim() !== '') {
      search = search.trim().toLowerCase();
      whereClause[Op.and] = [
        {
          [Op.or]: [
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('username')), 'LIKE', `%${search}%`),
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('role')), 'LIKE', `%${search}%`),
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('action')), 'LIKE', `%${search}%`),
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('entity')), 'LIKE', `%${search}%`),
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('description')), 'LIKE', `%${search}%`)
          ]
        }
      ];
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [['created_at', 'DESC']]
    });

    res.json({
      logs: rows || [],
      page,
      totalPages: Math.ceil(count / limit),
      totalLogs: count
    });
  } catch (err) {
    console.error("Gabim në marrjen e audit logs:", err);
    res.status(500).json({ message: "Gabim në marrjen e audit logs" });
  }
};

exports.deleteAuditLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await AuditLog.findByPk(id);
    if (!log) {
      return res.status(404).json({ message: "Audit log nuk u gjet" });
    }

    await log.destroy();
    res.json({ message: "Audit log u fshi me sukses" });
  } catch (err) {
    console.error("Gabim gjatë fshirjes së audit log:", err);
    res.status(500).json({ message: "Gabim gjatë fshirjes së audit log" });
  }
};
