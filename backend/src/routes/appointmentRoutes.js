const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');


router.post('/', appointmentController.createAppointment);
router.get('/available', appointmentController.getAvailableSlots);
router.get('/user/:userId', appointmentController.getUserAppointments);
router.get('/pending', appointmentController.getPendingAppointments);
router.put('/:id/approve', appointmentController.approveAppointment);
router.put('/:id/cancel', appointmentController.cancelAppointment);

module.exports = router;
