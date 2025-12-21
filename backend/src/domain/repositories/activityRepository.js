const { Op, Sequelize } = require("sequelize");
const Activity = require("../models/Activity");
const User = require("../models/User");
const AppointmentRequest = require("../models/AppointmentRequest");

class ActivityRepository {
  async create(data) {
    return Activity.create(data);
  }

  async findById(id) {
    return Activity.findByPk(id, {
      include: [
        { model: User, attributes: ["id", "first_name", "last_name"] },
        { model: AppointmentRequest, attributes: ["id", "scheduled_date", "status"] },
      ],
    });
  }

  async findAll(where = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Activity.findAndCountAll({
      where,
      include: [
        { model: User, attributes: ["id", "first_name", "last_name"] },
        { model: AppointmentRequest, attributes: ["id", "scheduled_date", "status"] },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });
    return { rows, count };
  }

  async findByUser(userId) {
    return Activity.findAll({
      where: { user_id: userId },
      include: [
        { model: AppointmentRequest, attributes: ["id", "scheduled_date", "status"] },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  async update(activity, data) {
    Object.assign(activity, data);
    return activity.save();
  }

  async delete(activity) {
    return activity.destroy();
  }
}

module.exports = new ActivityRepository();
