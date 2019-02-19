const db = require('../_helpers/db');
const Lesson = db.Lesson;
const Program = db.Program;

// function to save lesson to the database
function createProgram(req, res) {
	req.checkBody('title', 'Title Required').notEmpty();
	req.checkBody('discipline', 'Discipline Required').notEmpty();
	req.checkBody('author', 'Author Required').notEmpty();

	let program = new Program(req.body);
	console.log(program);
	// save lesson
	program.save().then((user) => res.json(user).catch((err) => res.json(err)));
}

// function to fetch all the lessons from database
async function fetchAllPrograms(req, res) {
	await Program.find({}).then((content) => res.json(content)).catch((err) => res.json(err));
}

function programlessons(req, res) {
	Program.findOne({ title: req.body.title }).populate('lessons').exec(function(err, result) {
		if (err) {
			res.json({ status: false, error: err });
		} else {
			res.json({ status: true, user: result });
		}
	});
}

function fetchProgram(req, res) {
	Program.find({ title: req.body.title })
		.then((content) => res.json(content))
		.catch((err) => releaseEvents.json(err));
}

function changeType(req, res) {
	req.checkBody('type', 'Type cannot be empty').notEmpty();

	Program.findOneAndUpdate(
		{ title: req.body.title },
		{
			$set: {
				type: req.body.type
			}
		},
		{ new: true }
	)
		.then((content) => res.json(content))
		.catch((err) => res.json(err));
}

module.exports = {
	createProgram,
	fetchAllPrograms,
	fetchProgram,
	programlessons,
	changeType
};
