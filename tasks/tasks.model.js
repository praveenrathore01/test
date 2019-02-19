const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	title: { type: String },
	author: { type: String },
	content: [
		{
			question: { type: String, required: true },
			options: []
		}
	],
	correctanswer: { type: String, required: true }
});

module.exports = mongoose.model('Tasks', schema);
