const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/config/db');

const AppointmentRequest = sequelize.define('AppointmentRequest', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },

  status: {
    type: DataTypes.ENUM('pending', 'scheduled', 'completed', 'cancelled', 'missed'),
    defaultValue: 'pending'
  },


  scheduled_date: { type: DataTypes.STRING, allowNull: true },
  note: { type: DataTypes.TEXT, allowNull: true },
  
  request_date: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
}

});

module.exports = AppointmentRequest;
