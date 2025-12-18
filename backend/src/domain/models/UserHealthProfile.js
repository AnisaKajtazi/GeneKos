const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/config/db');
const AppointmentRequest = require('./AppointmentRequest');

const UserHealthProfile = sequelize.define('UserHealthProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },
  request_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: 'AppointmentRequests', key: 'id' }
  },
  height: { type: DataTypes.FLOAT, allowNull: true },
  weight: { type: DataTypes.FLOAT, allowNull: true },
  blood_type: { type: DataTypes.STRING, allowNull: true },
  allergies: { type: DataTypes.TEXT, allowNull: true },
  medical_conditions: { type: DataTypes.TEXT, allowNull: true },
  medications: { type: DataTypes.TEXT, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

module.exports = UserHealthProfile;