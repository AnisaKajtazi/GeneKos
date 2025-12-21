const UserHealthProfile = require("../models/UserHealthProfile");
const AppointmentRequest = require("../models/AppointmentRequest");

class UserHealthProfileRepository {
  async create(data) {
    return UserHealthProfile.create(data);
  }

  async findById(id) {
    return UserHealthProfile.findByPk(id);
  }

  async findByUserId(userId) {
    return UserHealthProfile.findAll({
      where: { user_id: userId },
      include: [
        {
          model: AppointmentRequest,
          as: "appointment",
          attributes: ["id", "scheduled_date", "status"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  async findAppointmentById(requestId) {
    return AppointmentRequest.findByPk(requestId, {
      include: [{ model: UserHealthProfile, as: "healthProfile" }],
    });
  }

  async update(profile, data) {
    Object.assign(profile, data);
    return profile.save();
  }

  async delete(profile) {
    return profile.destroy();
  }
}

module.exports = new UserHealthProfileRepository();
