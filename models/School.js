const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true,
  },
  principalName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  coordinator: {
    type: String,
    ref: 'Coordinator',
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('School', SchoolSchema);
