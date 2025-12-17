const AuditLog = require('../../domain/models/AuditLog');

exports.getAllAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim në marrjen e audit logs" });
  }
};
