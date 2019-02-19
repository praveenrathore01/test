const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	_id: { type: Number },
	title: { type: String },
	avatar: { type: String },
	description: { type: String },
	start: { type: Date, default: Date.now },
	end: { type: Date },
	type: { type: String },
	calendar: { type: String },
	discipline: { type: String }
});

module.exports = mongoose.model('Calendar', schema);
