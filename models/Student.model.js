const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
  assignments: Map,
});

module.exports = mongoose.model('Student', studentSchema);
