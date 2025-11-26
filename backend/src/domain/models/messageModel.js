const { DataTypes } = require("sequelize");
const sequelize = require('../../infrastructure/config/db');

const Message = sequelize.define("Message", {
  sender_id: { type: DataTypes.INTEGER, allowNull: false },
  receiver_id: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  timestamps: true,
});

module.exports = Message;
