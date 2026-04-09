const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Temporary in-memory fallback store when MongoDB is unavailable.
// This keeps demo/signup flow working during DB outages.
const fallbackUsers = [];

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { fullName, username, age, door, flat, mobileNumber, email, password } = req.body;

    // Validate required fields
    if (!username || !password || !fullName || !email) {
      return res.status(400).json({ message: 'Username, password, full name, and email are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Fallback mode when DB is down
    if (!isDatabaseConnected()) {
      const existingFallbackUser = fallbackUsers.find((u) => u.username === username);

      if (existingFallbackUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const tempUser = {
        _id: `temp_${Date.now()}`,
        username,
        password: hashedPassword,
        fullName,
        email,
        age,
        door,
        flat,
        mobileNumber,
        isAdmin: false
      };

      fallbackUsers.push(tempUser);

      const token = jwt.sign(
        { userId: tempUser._id, username: tempUser.username, isAdmin: tempUser.isAdmin },
        process.env.JWT_SECRET || 'your_jwt_secret_key'
      );

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          _id: tempUser._id,
          username: tempUser.username,
          fullName: tempUser.fullName,
          email: tempUser.email,
          age: tempUser.age,
          mobileNumber: tempUser.mobileNumber,
          flat: tempUser.flat,
          isAdmin: tempUser.isAdmin
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({
      fullName,
      username,
      age,
      door,
      flat,
      mobileNumber,
      email,
      password
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your_jwt_secret_key'
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        mobileNumber: user.mobileNumber,
        flat: user.flat
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = username || email;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Username/email and password are required' });
    }

    // Fallback mode when DB is down
    if (!isDatabaseConnected()) {
      const fallbackUser = fallbackUsers.find((u) => u.username === identifier);
      if (!fallbackUser) {
        return res.status(404).json({ message: 'User not found (temporary offline mode)' });
      }

      const isPasswordValid = await bcrypt.compare(password, fallbackUser.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const token = jwt.sign(
        { userId: fallbackUser._id, username: fallbackUser.username, isAdmin: fallbackUser.isAdmin },
        process.env.JWT_SECRET || 'your_jwt_secret_key'
      );

      return res.status(200).json({
        message: 'Login successful (temporary offline mode)',
        token,
        user: {
          _id: fallbackUser._id,
          username: fallbackUser.username,
          email: fallbackUser.email,
          fullName: fallbackUser.fullName,
          age: fallbackUser.age,
          mobileNumber: fallbackUser.mobileNumber,
          flat: fallbackUser.flat,
          isAdmin: fallbackUser.isAdmin
        }
      });
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your_jwt_secret_key'
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        age: user.age,
        mobileNumber: user.mobileNumber,
        flat: user.flat,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router;
