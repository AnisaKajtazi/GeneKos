const appointmentService = require("../../services/appointmentService");

exports.createAppointment = async (req, res) => {
  try {
    const result = await appointmentService.createAppointment(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const slots = await appointmentService.getAvailableSlots(req.query.date);
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getUserAppointments(req.params.userId);
    res.json({ appointments });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.getPendingAppointments = async (req, res) => {
  try {
    const pending = await appointmentService.getPendingAppointments();
    res.json(pending);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.approveAppointment = async (req, res) => {
  try {
    const approved = await appointmentService.approveAppointment(req.params.id);
    res.json({ message: "Appointment approved", appointment: approved });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const cancelled = await appointmentService.cancelAppointment(req.params.id);
    res.json({ message: "Appointment cancelled", appointment: cancelled });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.getAllAppointmentRequests = async (req, res) => {
  try {
    const requests = await appointmentService.getAllAppointmentRequests();
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};
