const mongoose = require('mongoose');

const CoordinatorSchema = new mongoose.Schema({
  coordinatorName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    ref: 'School',
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
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
 
  isAdmin: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('Coordinator', CoordinatorSchema);
