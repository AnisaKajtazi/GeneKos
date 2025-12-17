const express = require('express');
const router = express.Router();

const appointmentController = require('../controllers/appointmentController');

router.get('/', appointmentController.getAllAppointmentRequests);
router.get('/user/:userId', appointmentController.getUserAppointments);


module.exports = router;
