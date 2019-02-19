const mongoose = require('mongoose');
dburl = 'mongodb://anas:3125mhow@ds117535.mlab.com:17535/onlineschool-api';
mongoose.connect(dburl, {
	useNewUrlParser: true,
	user: process.env.DB_USER,
	pass: process.env.DB_PASSWORD
});

const db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// mongoose.connect(process.env.DB_CONN);
mongoose.Promise = global.Promise;

module.exports = {
	User: require('../users/user.model'),
	Calendar: require('../calendar/calendar.model'),
	Lesson: require('../lesson/lesson.model'),
	Program: require('../programs/programs.model'),
	Student: require('../students/students.model'),
	Tasks: require('../tasks/tasks.controller'),
	Messages: require('../message/message.model')
};
