const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'clinic', 'user'), allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: true },
  date_of_birth: { type: DataTypes.DATEONLY, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: true },
  is_active: {type: DataTypes.BOOLEAN, defaultValue: true}
});

module.exports = User;
