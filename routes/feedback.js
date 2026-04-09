const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const router = express.Router();

// In-memory fallback for feedback submissions when DB is unavailable
const fallbackFeedbacks = [];

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

// Submit feedback
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { rating, comments, category, isAnonymous } = req.body;
    const user = isDatabaseConnected() ? await User.findById(req.user.userId).catch(() => null) : null;

    if (!rating || !comments || !comments.trim()) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    if (!isDatabaseConnected()) {
      const tempFeedback = {
        _id: `fb_${Date.now()}`,
        userId: req.user.userId.toString(),
        username: isAnonymous ? 'Anonymous' : (user?.username || req.user.username || 'Resident'),
        rating,
        comments,
        category: category || 'Other',
        isAnonymous: isAnonymous || false,
        createdAt: new Date()
      };

      fallbackFeedbacks.push(tempFeedback);

      return res.status(201).json({
        message: 'Feedback submitted successfully',
        feedback: tempFeedback
      });
    }

    const feedback = new Feedback({
      userId: req.user.userId,
      username: isAnonymous ? 'Anonymous' : (user?.username || req.user.username || 'Resident'),
      rating,
      comments,
      category: category || 'Other',
      isAnonymous: isAnonymous || false
    });

    await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
});

// Get all feedback by current user
router.get('/my-feedback', authenticateToken, async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const feedbacks = fallbackFeedbacks
        .filter((f) => f.userId === req.user.userId.toString())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json(feedbacks);
    }

    const feedbacks = await Feedback.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
});

module.exports = router;
