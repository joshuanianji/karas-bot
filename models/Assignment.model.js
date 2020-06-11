const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
  deadline: Date
});

module.exports = mongoose.model('Assignment', assignmentSchema);
