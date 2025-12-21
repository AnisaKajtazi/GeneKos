const { Op } = require("sequelize");
const AppointmentRequest = require("../models/AppointmentRequest");

class AppointmentRepository {
  async create(data) {
    return AppointmentRequest.create(data);
  }

  async findOne(where) {
    return AppointmentRequest.findOne({ where });
  }

  async findAll(where, order = [["scheduled_date", "ASC"]], attributes = null) {
    const options = { where, order };
    if (attributes) options.attributes = attributes;
    return AppointmentRequest.findAll(options);
  }

  async findById(id) {
    return AppointmentRequest.findByPk(id);
  }

  async update(appointment, data) {
    Object.assign(appointment, data);
    return appointment.save();
  }
}

module.exports = new AppointmentRepository();
