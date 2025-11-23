const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AppointmentRequest = sequelize.define('AppointmentRequest', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },

  status: {
    type: DataTypes.ENUM('pending', 'scheduled', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },

  scheduled_date: { type: DataTypes.DATE, allowNull: true },
  note: { type: DataTypes.TEXT, allowNull: true }
});

module.exports = AppointmentRequest;
