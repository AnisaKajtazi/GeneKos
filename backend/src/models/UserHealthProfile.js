const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserHealthProfile = sequelize.define('UserHealthProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },

  height: { type: DataTypes.FLOAT, allowNull: true },
  weight: { type: DataTypes.FLOAT, allowNull: true },
  blood_type: { type: DataTypes.STRING, allowNull: true },
  allergies: { type: DataTypes.TEXT, allowNull: true },
  medical_conditions: { type: DataTypes.TEXT, allowNull: true },
  medications: { type: DataTypes.TEXT, allowNull: true }
});

module.exports = UserHealthProfile;
