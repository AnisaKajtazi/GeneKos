const appointmentRepository = require("../domain/repositories/appointmentRepository");
const { slots, isValidSlot } = require("../presentation/utils/appointmentSlots");
const { Op } = require("sequelize");

class AppointmentService {
  async createAppointment({ user_id, scheduled_date, note }) {
    if (!user_id || !scheduled_date) throw { status: 400, message: "user_id and scheduled_date are required" };

    const today = new Date().setHours(0, 0, 0, 0);
    const chosen = new Date(scheduled_date).setHours(0, 0, 0, 0);
    if (chosen < today) throw { status: 400, message: "Past dates are not allowed" };

    const time = scheduled_date.slice(11, 16);
    if (!isValidSlot(time)) throw { status: 400, message: "Invalid slot selected" };

    const exists = await appointmentRepository.findOne({
      scheduled_date,
      status: { [Op.in]: ["pending", "scheduled"] }
    });
    if (exists) throw { status: 409, message: "This appointment slot is already taken." };

    const appointment = await appointmentRepository.create({ user_id, scheduled_date, note });
    return { message: "Appointment request submitted successfully!", appointment };
  }

  async getAvailableSlots(date) {
    if (!date) throw { status: 400, message: "Date is required" };

    const appointments = await appointmentRepository.findAll({
      scheduled_date: { [Op.like]: `${date}%` },
      status: { [Op.in]: ["pending", "scheduled"] }
    });

    const takenSlots = appointments.map(a => a.scheduled_date.slice(11, 16));
    const availableSlots = slots.filter(slot => !takenSlots.includes(slot));

    return { date, available_slots: availableSlots };
  }

  async getUserAppointments(userId) {
    if (!userId) throw { status: 400, message: "User ID is required" };
    return appointmentRepository.findAll({ user_id: userId }, [["scheduled_date", "ASC"]]);
  }

  async getPendingAppointments() {
    return appointmentRepository.findAll({ status: 'pending' }, [['request_date', 'ASC']]);
  }

  async approveAppointment(id) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment) throw { status: 404, message: "Appointment not found" };

    return appointmentRepository.update(appointment, { status: 'scheduled' });
  }

  async cancelAppointment(id) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment) throw { status: 404, message: "Appointment not found" };

    return appointmentRepository.update(appointment, { status: 'cancelled' });
  }

  async getAllAppointmentRequests() {
    return appointmentRepository.findAll({}, [['scheduled_date', 'ASC']], ['id', 'scheduled_date', 'status']);
  }
}

module.exports = new AppointmentService();
