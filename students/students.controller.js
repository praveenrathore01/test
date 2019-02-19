const db = require('_helpers/db');
const User = db.User;
const Student = db.Student;
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
var key = 'abcdefghijklmnopqrstuvwxyztgbhgf'; //  should be of 32 digits
let iv = '1234567891234567';
const cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
const decipher = crypto.createDecipheriv(algorithm, new Buffer.from(key), iv);

function getStudent(req, res) {
	User.find({ email: req.body.email, role: 'parent' })
		.populate('students')
		.exec(function(err, user) {
			if (user) {
				res.json({ status: true, students: user });
			} else {
				res.json({ status: false, error: 'User not found' });
			}
		});
}

async function createStudent(req, res) {
	let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
	var encrypted = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');

	User.findOne({ email: req.body.parentname }).then((users) => createstud(users));

	function createstud(users) {
		let student = new Student({
			email: req.body.email,
			password: encrypted,
			parents: users.id
		});

		student.save();

		User.findOneAndUpdate(
			{ email: req.body.parentname },
			{ $push: { students: student._id } },
			{ new: true }
		)
			.then((user) => res.json({ status: true, user: user }))
			.catch((err) => res.json(err));
	}
}

//route for changing the student plan
function changePlan(req, res) {
	Student.findOneAndUpdate(
		{ email: req.body.email },
		{
			$set: { package: req.body.plan }
		},
		{ new: true }
	)
		.then((stud) => res.json({ status: true, students: stud }))
		.catch((err) => res.json({ status: false, error: err }));
}

function viewStudent(req, res) {
	Student.findOne({ email: req.body.email })
		.then((users) => res.json({ status: true, user: showStudent(users) }))
		.catch((err) => res.json({ status: false, error: err }));

	function showStudent(users) {
		let password = users.password;
		let decipher = crypto.createDecipheriv(algorithm, new Buffer.from(key), iv);
		let decrypted = decipher.update(password, 'hex', 'utf8') + decipher.final('utf8');
		return decrypted;
	}
}

function editStudent(req, res) {
	Student.findOneAndUpdate({ email: req.body.email }, { $set: { firstName: req.body.firstname } })
		.then((user) => res.json({ status: true, user: user }))
		.catch((err) => res.json({ status: false, error: err }));
}

module.exports = {
	getStudent,
	createStudent,
	changePlan,
	viewStudent,
	editStudent
};
