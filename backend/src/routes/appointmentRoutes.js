const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');


router.post('/', appointmentController.createAppointment);

router.get('/available', appointmentController.getAvailableSlots);

router.get('/user/:userId', appointmentController.getUserAppointments);

module.exports = router;
