const userService = require('../users/user.service.js');
const userController = require('../users/users.controller');
const studentController = require('../students/students.controller');
const express = require('express');
const router = express.Router();

router.get('/getallteachers', userController.getAllTeachers);
router.get('/getalladmins', userController.getAllAdmins);
router.get('/getallparents', userController.getAllParents);
router.get('/check', userController.checkSession);
router.get('/setpassword/:token', userController.verifytoken);
router.get('/logout', userController.logout);
router.post('/login', userController.authenticate);
router.post('/register', userController.register);
router.post('/token', userController.assignToken);
router.post('/setpassword/:token', userController.setPassword);
// forgot password route
router.post('/forgotpassword', userController.forgotPassword);
// for setting permissons to user
router.post('/permissions/:reply', userController.assignReply);
// for showing users credentials
router.post('/view', userController.viewUser);
// for editing users email
router.post('/edit/:type', userController.editUser);
//for changing roles
router.post('/edit/role/:newrole', userController.editRole);
// get student route
router.post('/getstudents', studentController.getStudent);
// create students route
router.post('/createstudent', studentController.createStudent);
// change plan of students
router.post('/students/changeplan', studentController.changePlan);
// view student credentials
router.post('/student/view', studentController.viewStudent);
module.exports = router;
