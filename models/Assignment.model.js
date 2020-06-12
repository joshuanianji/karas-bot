const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
  deadline: Date,
  course: String,
  name: String,
});

module.exports = mongoose.model('Assignment', assignmentSchema);
