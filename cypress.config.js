const { defineConfig } = require("cypress");
const AppointmentRequest = require("./backend/src/domain/models/AppointmentRequest");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      on("task", {
        updateAppointmentStatus({ appointmentId, status }) {
          return AppointmentRequest.findByPk(appointmentId).then((appointment) => {
            if (!appointment) {
              throw new Error(`Appointment with ID ${appointmentId} not found`);
            }
            appointment.status = status;
            return appointment.save().then((updated) => ({ id: updated.id, status: updated.status }));
          });
        },
        createCompletedAppointment({ userId, scheduledDate, note }) {
          return AppointmentRequest.create({
            user_id: userId,
            scheduled_date: scheduledDate,
            note,
            status: 'completed',
          }).then((created) => ({ id: created.id, user_id: created.user_id, status: created.status }));
        },
      });
      return config;
    },
  },
});