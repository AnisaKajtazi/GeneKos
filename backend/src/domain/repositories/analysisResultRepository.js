const fs = require("fs");
const path = require("path");
const { Op, Sequelize } = require("sequelize");
const AnalysisResult = require("../models/AnalysisResult");
const AppointmentRequest = require("../models/AppointmentRequest");
const User = require("../models/User");

class AnalysisResultRepository {
  async create(data) {
    return AnalysisResult.create(data);
  }

  async findById(id) {
    return AnalysisResult.findByPk(id, {
      include: [
        {
          model: AppointmentRequest,
          attributes: ["id", "scheduled_date", "status", "user_id"],
          include: [{ model: User, attributes: ["id", "first_name", "last_name"] }],
        },
      ],
    });
  }

  async findAll(where = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { count, rows } = await AnalysisResult.findAndCountAll({
      where,
      include: [
        {
          model: AppointmentRequest,
          attributes: ["id", "scheduled_date", "status", "user_id"],
          include: [{ model: User, attributes: ["id", "first_name", "last_name"] }],
        },
      ],
      order: [["uploaded_at", "DESC"]],
      limit,
      offset,
    });
    return { rows, count };
  }

  async findByUser(userId) {
    return AnalysisResult.findAll({
      include: [
        {
          model: AppointmentRequest,
          where: { user_id: userId, status: "completed" },
          attributes: ["id", "scheduled_date", "status"],
        },
      ],
      order: [["uploaded_at", "DESC"]],
    });
  }

  async update(analysis, data) {
    Object.assign(analysis, data);
    return analysis.save();
  }

  async delete(analysis) {
    const filePath = path.join(process.cwd(), analysis.pdf_url.replace(/^\/+/, ""));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return analysis.destroy();
  }
}

module.exports = new AnalysisResultRepository();
