const { Op, Sequelize } = require("sequelize");
const User = require("../models/User"); 

class UserRepository {
  async findAndCountAll({ where, offset, limit, order, attributes }) {
    return User.findAndCountAll({ where, offset, limit, order, attributes });
  }

  async findById(id) {
    return User.findByPk(id);
  }

  async create(data) {
    return User.create(data);
  }

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return user.update(data);
  }
}

module.exports = new UserRepository();
