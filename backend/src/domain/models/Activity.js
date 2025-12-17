const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/config/db');

const Activity = sequelize.define('Activity', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },

  request_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'AppointmentRequests', key: 'id' }
  },

  analysis_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'AnalysisResults', key: 'id' }
  },

  activity_plan: { type: DataTypes.TEXT, allowNull: false },

  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Activity;
