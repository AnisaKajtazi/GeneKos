const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/config/db');

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  user_id: { type: DataTypes.INTEGER, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },

  action: { type: DataTypes.STRING, allowNull: false },
  entity: { type: DataTypes.STRING, allowNull: false },
  entity_id: { type: DataTypes.INTEGER },

  description: { type: DataTypes.STRING },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'audit_logs',
  timestamps: false
});

module.exports = AuditLog;
