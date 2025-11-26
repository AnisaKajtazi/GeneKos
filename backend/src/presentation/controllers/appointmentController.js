const AppointmentRequest = require("../../domain/models/AppointmentRequest");
const { slots, isValidSlot } = require("../utils/appointmentSlots");
const { Op } = require("sequelize");


exports.createAppointment = async (req, res) => {
  try {
    const { user_id, scheduled_date, note } = req.body;

    if (!user_id || !scheduled_date)
      return res.status(400).json({ message: "user_id and scheduled_date are required" });

    const time = scheduled_date.slice(11, 16);


    if (!isValidSlot(time))
      return res.status(400).json({ message: "Invalid slot selected" });


    const exists = await AppointmentRequest.findOne({
      where: {
        scheduled_date,
        status: { [Op.in]: ["pending", "scheduled"] }
      }
    });

    if (exists)
      return res.status(409).json({ message: "This appointment slot is already taken." });


    const appointment = await AppointmentRequest.create({
      user_id,
      scheduled_date,
      note
    });

    return res.status(201).json({
      message: "Appointment request submitted successfully!",
      appointment
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });


    const appointments = await AppointmentRequest.findAll({
      where: {
        scheduled_date: {
          [Op.like]: `${date}%`  
        },
        status: { [Op.in]: ["pending", "scheduled"] }
      }
    });

    const takenSlots = appointments.map(a => a.scheduled_date.slice(11, 16));

    
    const availableSlots = slots.filter(slot => !takenSlots.includes(slot));

    return res.json({ date, available_slots: availableSlots });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const appointments = await AppointmentRequest.findAll({
      where: { user_id: userId },
      order: [["scheduled_date", "ASC"]]
    });

    return res.json({ appointments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getPendingAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentRequest.findAll({
      where: { status: 'pending' },
      order: [['request_date', 'ASC']]
    });
    return res.json(appointments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.approveAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await AppointmentRequest.findByPk(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = 'scheduled';
    await appointment.save();
    return res.json({ message: "Appointment approved", appointment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await AppointmentRequest.findByPk(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = 'cancelled';
    await appointment.save();
    return res.json({ message: "Appointment cancelled", appointment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

