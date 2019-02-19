require('dotenv').config();
require('rootpath')();
const express = require('express');
// const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const cookieparser = require('cookie-parser');
const session = require('express-session');
var morgan = require('morgan');

var app = express();
const expressValidator = require('express-validator');
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

// var server = app.listen(3000);
// var io = require('socket.io').listen(server);
// io.on('connection', (socket) => {
// 	console.log('user connected');

// 	//create message event
// 	socket.on('pmessage', (message) => {
// 		console.log(message);

// 		//sending messag eto everyone connected on this channel
// 		io.emit('newMessage', {
// 			text: message.text
// 		});
// 	});
// });

// code for socket.io react starts from here

var socket = require('socket.io');

// start server
const port = process.env.PORT || 4000;
const server = app.listen(port, function() {
	console.log(`Server listening on port ${port}`);
});

io = socket(server);

io.on('connection', (socket) => {
	console.log(socket.id);

	socket.on('SEND_MESSAGE', function(data) {
		console.log(data);
		io.emit('RECEIVE_MESSAGE', data);
	});
});

app.use(cookieparser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
	session({
		key: 'user_sid',
		secret: 'secret',
		resave: false,
		saveUninitialized: false,
		cookie: {
			expires: 600000
		}
	})
);

// // middleware function to check for logged in users
// let sessionChecker = (req, res, next) => {
//     if (req.session.user && req.cookies.user_sid) {
//         res.redirect('/');
//     } else {
//         next();
//     }
// };

// // middleware for checking if the cookie information is saved or not
// app.use((req, res, next) => {
//     if (req.cookies.user_sid && !req.session.user) {
//         res.clearCookie('user_sid');
//     }
//     next();
// });

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./routes/user_routes.js'));
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use('/calendar', require('./routes/calendar_routes.js'));
app.use('/programs', require('./routes/lesson_routes.js'));
// global error handler
app.use(errorHandler);
