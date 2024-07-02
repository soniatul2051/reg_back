const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  grade: {
    type: String, 
    required: true,
  },
  school: {
    type: String,
    ref: 'School',
    required: true,
  },
  parentName: {
    type: String,
    required: true,
  },
  parentContactNumber: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Student', StudentSchema);
