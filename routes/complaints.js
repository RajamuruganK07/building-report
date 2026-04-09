const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const router = express.Router();

// In-memory fallback for complaint submissions when DB is unavailable
const fallbackComplaints = [];

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

// Submit a complaint
router.post('/', authenticateToken, upload.single('evidence'), async (req, res) => {
  try {
    const { description, category, priority, fullName, flatNumber, age, mobileNumber, doorNumber } = req.body;
    const user = isDatabaseConnected() ? await User.findById(req.user.userId).catch(() => null) : null;

    const resolvedName = fullName || user?.fullName || user?.username || req.user.username;
    const resolvedAge = age || user?.age || null;
    const resolvedMobile = mobileNumber || user?.mobileNumber || null;
    const resolvedFlat = flatNumber || user?.flat || user?.flatNumber || null;
    const resolvedDoor = doorNumber || user?.door || user?.doorNumber || null;

    if (!description || !description.trim() || !category || !priority || !resolvedName || !resolvedFlat) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    if (!isDatabaseConnected()) {
      const tempComplaint = {
        _id: `cmp_${Date.now()}`,
        userId: req.user.userId.toString(),
        username: resolvedName,
        age: resolvedAge,
        doorNumber: resolvedDoor,
        flatNumber: resolvedFlat,
        mobileNumber: resolvedMobile,
        description,
        category: category || 'Other',
        priority: priority || 'Medium',
        status: 'Pending',
        evidenceFile: req.file ? `/uploads/${req.file.filename}` : null,
        evidenceOriginalName: req.file ? req.file.originalname : null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      fallbackComplaints.push(tempComplaint);

      return res.status(201).json({
        message: 'Complaint submitted successfully',
        complaint: tempComplaint
      });
    }

    const complaint = new Complaint({
      userId: req.user.userId.toString(),
      username: resolvedName,
      age: resolvedAge,
      doorNumber: resolvedDoor,
      flatNumber: resolvedFlat,
      mobileNumber: resolvedMobile,
      description,
      category: category || 'Other',
      priority: priority || 'Medium',
      evidenceFile: req.file ? `/uploads/${req.file.filename}` : null,
      evidenceOriginalName: req.file ? req.file.originalname : null
    });

    await complaint.save();

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting complaint', error: error.message });
  }
});

// Get all complaints of current user
router.get('/my-complaints', authenticateToken, async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const complaints = fallbackComplaints
        .filter((c) => c.userId === req.user.userId.toString())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json(complaints);
    }

    const complaints = await Complaint.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints', error: error.message });
  }
});

// Get single complaint
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user is the owner or admin
    if (complaint.userId.toString() !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaint', error: error.message });
  }
});

// Update complaint (only status and priority for users)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Cannot update others\' complaints' });
    }

    const { description, category, priority } = req.body;
    complaint.description = description || complaint.description;
    complaint.category = category || complaint.category;
    complaint.priority = priority || complaint.priority;
    complaint.updatedAt = Date.now();

    await complaint.save();

    res.status(200).json({
      message: 'Complaint updated successfully',
      complaint
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint', error: error.message });
  }
});

// Delete complaint
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Cannot delete others\' complaints' });
    }

    await Complaint.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting complaint', error: error.message });
  }
});

module.exports = router;
