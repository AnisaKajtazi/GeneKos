const Diet = require("../models/Diet");
const User = require("../models/User");
const AnalysisResult = require("../models/AnalysisResult");
const AppointmentRequest = require("../models/AppointmentRequest");

class DietRepository {
  async create(data) {
    return Diet.create(data);
  }

  async findById(id) {
    return Diet.findByPk(id);
  }

  async findAll() {
    return Diet.findAll({
      include: [
        { model: User, attributes: ["id", "first_name", "last_name"], required: false },
        {
          model: AnalysisResult,
          attributes: ["id", "analysis_type"],
          required: false,
          include: [
            {
              model: AppointmentRequest,
              attributes: ["id", "scheduled_date", "status"],
              required: false,
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  async findByUser(userId) {
    return Diet.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });
  }

  async update(diet, data) {
    Object.assign(diet, data);
    return diet.save();
  }

  async delete(diet) {
    return diet.destroy();
  }
}

module.exports = new DietRepository();
