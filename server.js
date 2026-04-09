const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Connection with improved retry options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  retryWrites: true,
  maxPoolSize: 10,
  minPoolSize: 5,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.log('⚠️ MongoDB connection error (retrying):', err.message);
  // App continues running even if MongoDB fails initially
  // This allows seeding via API
});

// Routes
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// Home route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
