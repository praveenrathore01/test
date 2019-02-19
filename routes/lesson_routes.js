const lessonController = require('../lesson/lesson.controller');
const programController = require('../programs/programs.controller');
const express = require('express');
const router = express.Router();

// Lesson Routes

//Lesson GET route to fetch lessons
// router.get('/lesson/fetch', lessonController.fetchLesson);

//Lesson post route for sending data to the database
router.post('/lesson/post', lessonController.postLesson);

//Create Program route
router.post('/create', programController.createProgram);

//fetch programs route
router.post('/getlessons', programController.programlessons);
// router.post('/fetch', programController.fetchPrograms);

//change the type of a program from hidden to something
router.post('/changetype', programController.changeType);

// change the type of lesson from hidden to somethhing
router.post('/lesson/changetype', lessonController.changeLessonType);

module.exports = router;
