const express = require('express');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const router = express.Router();

// Get all complaints
router.get('/complaints', authenticateToken, isAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints', error: error.message });
  }
});

// Update complaint status and add notes
router.put('/complaints/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, priority, adminNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status || complaint.status;
    complaint.priority = priority || complaint.priority;
    complaint.adminNotes = adminNotes || complaint.adminNotes;
    complaint.updatedAt = Date.now();

    await complaint.save();

    res.status(200).json({
      message: 'Complaint status updated',
      complaint
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint', error: error.message });
  }
});

// Get all feedback
router.get('/feedback', authenticateToken, isAdmin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
});

// Get statistics
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
    const totalFeedback = await Feedback.countDocuments();
    const totalUsers = await User.countDocuments();
    const avgRating = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.status(200).json({
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      totalFeedback,
      totalUsers,
      avgRating: avgRating[0]?.avgRating || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

module.exports = router;
