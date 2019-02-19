const db = require('../_helpers/db');
const Tasks = require('../tasks/tasks.model');

// function to save lesson to the database
function createTask(req, res) {
	//body validations
	req.checkBody('title', 'Title Required').notEmpty();
	req.checkBody('options', 'options Required').notEmpty();
	req.checkBody('correctanswer', 'Correct answer Required').notEmpty();

	// check the validation object for errors
	let errors = req.validationErrors();

	if (errors) {
		res.json({ status: false, messages: errors });
	} else {
		let task = new Task(req.body);
		// save lesson
		task.save().then((content) => res.json(content)).catch((err) => res.json(err));
	}
}

// function to fetch all the tasks from database
async function fetchAllTasks(req, res) {
	await Task.find({}).then((content) => res.json(content)).catch((err) => res.json(err));
}

//function to fetch particlar tasks from database
function fetchTasks(req, res) {
	Program.findOne({ title: req.body.title }).populate('lessons').exec(function(err, result) {
		if (err) {
			res.json({ status: false, error: err });
		} else {
			res.json({ status: true, user: result });
		}
	});
}

module.exports = {
	createTask,
	fetchAllTasks,
	fetchTasks
};
