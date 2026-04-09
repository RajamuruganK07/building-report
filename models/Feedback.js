const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comments: {
    type: String,
    required: true,
    minlength: 10
  },
  category: {
    type: String,
    enum: ['Management', 'Maintenance', 'Security', 'Community', 'Other'],
    default: 'Other'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
