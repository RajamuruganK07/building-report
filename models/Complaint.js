const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  username: String,
  age: Number,
  doorNumber: String,
  flatNumber: String,
  mobileNumber: String,
  description: {
    type: String,
    required: true,
    minlength: 10
  },
  category: {
    type: String,
    enum: ['Parking', 'Maintenance', 'Noise', 'Water/Electricity', 'Security', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Closed'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  evidenceFile: {
    type: String,
    default: null
  },
  evidenceOriginalName: {
    type: String,
    default: null
  },
  adminNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
