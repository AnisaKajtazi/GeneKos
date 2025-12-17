const AuditLog = require('../domain/models/AuditLog');


const createAuditLog = async ({ user_id, username, role, action, entity, entity_id, description }) => {
  try {
    await AuditLog.create({
      user_id,
      username,
      role,
      action,
      entity,
      entity_id,
      description
    });
  } catch (err) {
    console.error("Audit log error:", err);
  }
};

module.exports = { createAuditLog };
