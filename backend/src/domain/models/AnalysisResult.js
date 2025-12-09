const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/config/db');

const AnalysisResult = sequelize.define('AnalysisResult', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  request_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'AppointmentRequests', key: 'id' }
  },

  analysis_type: { 
    type: DataTypes.STRING,
    allowNull: false 
  },

  pdf_url: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },

  uploaded_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
});

module.exports = AnalysisResult;
