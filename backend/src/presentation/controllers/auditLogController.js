const auditLogService = require("../../services/auditLogService");

exports.getAllAuditLogs = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const result = await auditLogService.getAuditLogs({
      role: req.user.role,
      page,
      limit,
      search,
    });
    res.json(result);
  } catch (err) {
    console.error("Gabim në marrjen e audit logs:", err);
    res.status(err.status || 500).json({ message: err.message || "Gabim në marrjen e audit logs" });
  }
};

exports.deleteAuditLog = async (req, res) => {
  try {
    const { id } = req.params;
    await auditLogService.deleteAuditLogById(id);
    res.json({ message: "Audit log u fshi me sukses" });
  } catch (err) {
    console.error("Gabim gjatë fshirjes së audit log:", err);
    res.status(err.status || 500).json({ message: err.message || "Gabim gjatë fshirjes së audit log" });
  }
};
