const cookieparser = require('cookie-parser');
const userService = require('./user.service');
const db = require('_helpers/db');
const User = db.User;
const express = require('express');
const app = express();
const async = require('async');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
var key = 'abcdefghijklmnopqrstuvwxyztgbhgf';
let iv = '1234567891234567';
const cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
const decipher = crypto.createDecipheriv(algorithm, new Buffer.from(key), iv);

app.use(cookieparser());

// middleware function to check for logged in users
let sessionChecker = (req, res, next) => {
	// req.session.user &&
	if (req.cookies.user_sid) {
		res.json({ status: true });
	} else {
		next();
	}
};

// middleware for checking if the cookie information is saved or not
app.use((req, res, next) => {
	if (req.cookies.user_sid && !req.session.user) {
		res.clearCookie('user_sid');
	}
	next();
});

function checkSession(req, res) {
	if (req.cookies.user_sid) {
		res.json({ status: true });
	} else {
		res.json({ status: false });
	}
}

//forgot password function

function forgotPassword(req, res) {
	// Body validations
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Password2 is required').notEmpty();

	// check the validation object for errors
	let errors = req.validationErrors();

	if (errors) {
		res.json({ status: false, messages: errors });
	} else {
		if (req.body.password !== req.body.password2) {
			res.json({
				status: false,
				message: 'Passwords do not match'
			});
		} else {
			let password = req.body.password;
			const cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
			var encrypted = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
			User.findOneAndUpdate(
				{ email: req.body.email },
				{
					$set: {
						password: encrypted
					}
				}
			)
				.then((user) => res.json(user))
				.catch((err) => res.json(err));
		}
	}
}

// route for user Login
function authenticate(req, res) {
	// validate the input
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email does not appear to be valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();

	// check the validation object for errors
	let errors = req.validationErrors();

	if (errors) {
		res.json({ status: false, messages: errors });
	} else {
		let email = req.body.email;
		let password = req.body.password;
		let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
		var encrypted = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
		User.findOne({ email: email }).then(function(user) {
			app.get(sessionChecker, (req, res) => {
				res.json({ status: 'session stored' });
			});

			if (!user) {
				res.json({ status: false, error: 'User not found' });
			} else if (encrypted != user.password) {
				// bcrypt.compareSync(password, user.password
				res.json({ status: false, error: 'Password Incorrect' });
			} else {
				req.session.user = user;
				req.session.Auth = user;
				res.json({
					status: true,
					user: req.session.Auth
				});
			}
		});
	}
}

//route for loggging out
function logout(req, res) {
	// if(req.session.user && req.cookies.user_sid ) {

	res.clearCookie('user_sid');
	res.json({
		session: 'cleared',
		status: true
	});
	console.log(req);
}

function register(req, res, next) {
	userService.create(req, res, req.body);
}

// get all teachers
async function getAllTeachers(req, res, next) {
	let teach = {};
	await userService
		.getTeachers_verified()
		.then((users) => (teach = users))
		.catch((err) => next(err));
	userService
		.getTeachers_Nverified()
		.then((unverified) => res.json({ status: true, verified: teach, Unverified: unverified }))
		.catch((err) => res.json({ status: false, error: err }));
}

// get all parents
async function getAllParents(req, res, next) {
	let parents = {};
	await userService
		.getParents_verified()
		.then((users) => (parents = users))
		.catch((err) => next(err));
	userService
		.getParents_Nverified()
		.then((unverified) => res.json({ status: true, verified: parents, Unverified: unverified }))
		.catch((err) => res.json({ status: false, error: err }));
}

// get all admins
async function getAllAdmins(req, res, next) {
	let admin = {};
	await userService
		.getadmin_verified()
		.then((users) => (admin = users))
		.catch((err) => next(err));
	userService
		.getadmin_Nverified()
		.then((unverified) => res.json({ status: true, verified: admin, Unverified: unverified }))
		.catch((err) => res.json({ status: false, error: err }));
}

function assignToken(req, res, next) {
	console.log('token function from controller executed');
	console.log(req.body.email);
	userService
		.assignToken(req.body.email)
		.then(() => res.json({ success: true }))
		.catch((err) => next(err));
}

async function verifytoken(req, res, next) {
	console.log('verifyToken function executed');
	let token = req.params.token;
	console.log(token);
	async.waterfall(
		User.findOne({ passwordtoken: token, passwordexpires: { $gt: Date.now() } }, function(
			err,
			user
		) {
			if (user) {
				console.log('user found');
				res.status(200).json({ success: true, token: token });
			} else {
				console.log('User not found or token expired');
				res.status(404).json({ success: false, message: 'No user found or token expired' });
				console.log(user);
			}
		})
	);
}

function setPassword(req, res, next) {
	// Body validations
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Password2 is required').notEmpty();

	// check the validation object for errors
	let errors = req.validationErrors();

	if (errors) {
		res.json({ status: false, messages: errors });
	} else {
		if (req.body.password !== req.body.password2) {
			res.json({
				success: false,
				message: 'Passwords do not match'
			});
		} else {
			userService.setPassword(req.params.token, req.body.password);
			res.status(200).json({ success: true, token: req.params.token });
		}
	}
}

function viewUser(req, res) {
	User.findOne({ email: req.body.email }).then((data) => changepass(data));
	function changepass(data) {
		let password = data.password;
		let decipher = crypto.createDecipheriv(algorithm, new Buffer.from(key), iv);
		let decrypted = decipher.update(password, 'hex', 'utf8') + decipher.final('utf8');
		res.json({ password: decrypted });
	}
}

async function editUser(req, res) {
	// validate the input
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email does not appear to be valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();

	// check the validation object for errors
	let errors = req.validationErrors();

	if (errors) {
		res.json({ status: false, messages: errors });
	} else {
		if (await User.findOne({ email: req.body.email2 })) {
			res
				.status(200)
				.json({ status: false, error: 'Email ' + req.body.email2 + ' is already taken' });
		} else {
			let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
			var encrypted = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');
			User.findOneAndUpdate(
				{ email: req.body.email, role: req.params.type },
				{
					$set: { email: req.body.newemail, password: encrypted }
				}
			)
				.then((user) => res.json({ status: true }))
				.catch((err) => res.json(err));
		}
	}
}

function editRole(req, res) {
	User.findOneAndUpdate(
		{ email: req.body.email },
		{
			$set: {
				role: req.params.newrole
			}
		}
	)
		.then((users) => res.json(users))
		.catch((Err) => res.json(err));
}

function assignReply(req, res) {
	let reply;
	if (req.params.reply == 'approve') {
		reply = 'Approved';
	} else if (req.params.reply == 'decline') {
		reply = 'Rejected';
	}
	let email = req.body.email;

	User.findOneAndUpdate(
		{ email: email },
		{
			$set: {
				status: reply
			}
		}
	)
		.then(
			User.find({ email: req.body.email }).then((user) =>
				res.json({ status: true, User: user })
			)
		)
		.catch((err) => res.json(err));
}

module.exports = {
	checkSession,
	authenticate,
	logout,
	register,
	assignToken,
	verifytoken,
	setPassword,
	getAllTeachers,
	getAllParents,
	getAllAdmins,
	assignReply,
	editUser,
	editRole,
	viewUser,
	forgotPassword
};

// function getCurrent(req, res, next) {
//     userService.getById(req.user.sub)
//         .then(user => user ? res.json(user) : res.sendStatus(404))
//         .catch(err => next(err));
// }

// function getById(req, res, next) {
//     userService.getById(req.params.id)
//         .then(user => user ? res.json(user) : res.sendStatus(404))
//         .catch(err => next(err));
// }

// function update(req, res, next) {
//     userService.update(req.params.id, req.body)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }

// function _delete(req, res, next) {
//     userService.delete(req.params.id)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }

//  async function verifytoken(token){
//     console.log("from service");
//     User.findOne({passwordtoken: token, passwordexpires: { $gt: Date.now() } }, function(err, user) {
//         if (user) {
//              console.log("user found");
//         } else {
//              console.error("No user with such token or token expired")
//             }
//    })};
