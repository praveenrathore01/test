const calendarController = require('../calendar/calendar.controller');
const express = require('express');
const router = express.Router();

// Calendar routes

router.get('/getcalendar', calendarController.getdata);
router.post('/sendcalendar', calendarController.postcal_data);

module.exports = router;
