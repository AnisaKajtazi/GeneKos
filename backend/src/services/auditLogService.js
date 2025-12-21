const auditLogRepository = require("../domain/repositories/auditLogRepository");

class AuditLogService {
  async logAudit({ user, action, entity, entityId, description }) {
    if (!user) return; 
    try {
      await auditLogRepository.create({
        user_id: user.id,
        username: user.username,
        role: user.role,
        action,
        entity,
        entity_id: entityId,
        description,
      });
    } catch (err) {
      console.error("Audit log error:", err);
    }
  }

  async getAuditLogs({ role, page, limit, search }) {
    if (role !== "admin") throw { status: 403, message: "Nuk keni qasje në audit logs" };
    return auditLogRepository.findAll({ page, limit, search });
  }

  async deleteAuditLogById(id) {
    const log = await auditLogRepository.findById(id);
    if (!log) throw { status: 404, message: "Audit log nuk u gjet" };
    return auditLogRepository.delete(log);
  }
}

module.exports = new AuditLogService();
