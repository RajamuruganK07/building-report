# 🔧 INTEGRATION GUIDE - Adding Advanced Features

## Overview
This guide shows how to integrate the new enterprise features into your existing Apartment Complaint System.

### Features to Integrate:
1. ✅ Email Notifications
2. ✅ File Upload Handling  
3. ✅ PDF Report Generation
4. ✅ Redis Caching
5. ✅ Security Headers (Helmet)
6. ✅ Rate Limiting
7. ✅ Request Validation (Joi)
8. ✅ HTTP Logging (Morgan)

---

## Step 1: Install Dependencies

```bash
npm install
```

This will install all new packages from the updated `package.json`.

---

## Step 2: Update Environment Configuration

Update your `.env` file with the new configuration variables already added:

```env
# Email Service (Optional - enables email notifications)
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-gmail-app-password
ADMIN_EMAIL=admin@apartment.com
APP_URL=http://localhost:5000
ADMIN_URL=http://localhost:5000/admin

# Redis Cache (Optional - enables caching)
REDIS_HOST=localhost
REDIS_PORT=6379

# File Upload Settings
MAX_FILE_SIZE=5242880
ALLOWED_FILES=jpg,jpeg,png,gif,pdf,doc,docx

# Security Rate Limiting
RATE_LIMIT_WINDOWMS=900000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=debug
```

---

## Step 3: Update server.js with New Middleware

Replace your `server.js` with this enhanced version:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// ===== SECURITY MIDDLEWARE =====
app.use(helmet()); // Add security headers

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOWMS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: 'Too many requests, please try again later'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later'
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', rateLimit({ windowMs: 15 * 60 * 1000, max: 3 }));
app.use('/api', limiter); // Apply to all API routes

// ===== LOGGING MIDDLEWARE =====
app.use(morgan(process.env.LOG_LEVEL === 'debug' ? 'dev' : 'combined'));

// ===== BODY PARSING MIDDLEWARE =====
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ===== DATABASE CONNECTION =====
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// ===== API ROUTES =====
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// ===== HOME ROUTE =====
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// ===== ERROR HANDLING MIDDLEWARE =====
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Email Service: ${process.env.EMAIL_USER ? 'Enabled' : 'Disabled'}`);
  console.log(`⚡ Caching Service: ${process.env.REDIS_HOST ? 'Enabled' : 'Disabled'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📛 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    mongoose.connection.close();
  });
});

// Export app for testing
module.exports = app;
```

---

## Step 4: Add Email Service to Complaint Route

Update `routes/complaints.js` to send email notifications:

```javascript
// At the top of the file, add:
const emailService = require('../services/emailService');

// In the POST /api/complaints endpoint, after saving complaint:
router.post('/', auth, async (req, res) => {
  // ... existing validation code ...
  
  try {
    const newComplaint = new Complaint({
      userId: req.userId,
      description: req.body.description,
      category: req.body.category,
      priority: req.body.priority
    });

    const savedComplaint = await newComplaint.save();
    
    // 📧 Send email notification to admin
    try {
      const user = await User.findById(req.userId);
      await emailService.sendComplaintNotification(user, savedComplaint);
    } catch (emailError) {
      console.warn('Email not sent:', emailError.message);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: savedComplaint
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Step 5: Add File Upload to Complaint Route

Update `routes/complaints.js` to handle file uploads:

```javascript
// At the top of the file, add:
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Modify the POST /api/complaints endpoint:
router.post(
  '/',
  auth,
  uploadMiddleware.single('evidence'),
  async (req, res) => {
    // ... existing validation code ...

    try {
      const complaintData = {
        userId: req.userId,
        description: req.body.description,
        category: req.body.category,
        priority: req.body.priority
      };

      // If file was uploaded, save the path
      if (req.file) {
        complaintData.evidenceFile = req.file.path;
      }

      const newComplaint = new Complaint(complaintData);
      const savedComplaint = await newComplaint.save();

      res.status(201).json({
        message: 'Complaint submitted successfully',
        complaint: savedComplaint,
        fileUploaded: req.file ? true : false
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
```

---

## Step 6: Add Email to Feedback Route

Update `routes/feedback.js`:

```javascript
const emailService = require('../services/emailService');

router.post('/', auth, async (req, res) => {
  // ... existing validation code ...

  try {
    const newFeedback = new Feedback({
      userId: req.userId,
      rating: req.body.rating,
      comments: req.body.comments,
      category: req.body.category
    });

    const savedFeedback = await newFeedback.save();

    // 📧 Send thank you email
    try {
      const user = await User.findById(req.userId);
      await emailService.sendFeedbackThankYou(user);
    } catch (emailError) {
      console.warn('Email not sent:', emailError.message);
    }

    res.status(201).json({
      message: 'Thank you for your feedback!',
      feedback: savedFeedback
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Step 7: Add PDF Report Endpoints to Admin Route

Update `routes/admin.js`:

```javascript
const reportService = require('../services/reportService');

// Add new endpoint for complaint reports
router.get('/reports/complaints', auth, adminOnly, async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('userId', 'fullName email');
    const filePath = await reportService.generateComplaintReport(complaints);
    
    res.download(filePath, 'complaint_report.pdf', (err) => {
      if (err) {
        console.error('Download error:', err);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new endpoint for feedback reports
router.get('/reports/feedback', auth, adminOnly, async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('userId', 'fullName');
    const filePath = await reportService.generateFeedbackReport(feedback);
    
    res.download(filePath, 'feedback_report.pdf', (err) => {
      if (err) {
        console.error('Download error:', err);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Step 8: Add Caching to Admin Statistics

Update `routes/admin.js`:

```javascript
const cacheService = require('../services/cacheService');

router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    // Try to get from cache
    let stats = await cacheService.cacheGet('admin_stats');

    if (!stats) {
      // If not in cache, generate fresh stats
      const totalComplaints = await Complaint.countDocuments();
      const totalFeedback = await Feedback.countDocuments();
      const totalUsers = await User.countDocuments();

      const complaintsByCategory = await Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      const complaintsByStatus = await Complaint.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      stats = {
        totalComplaints,
        totalFeedback,
        totalUsers,
        complaintsByCategory,
        complaintsByStatus,
        generatedAt: new Date()
      };

      // Cache for 1 hour
      await cacheService.cacheSet('admin_stats', stats, 3600);
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Step 9: Add Input Validation Using Joi

Create validation schemas (optional but recommended):

```javascript
// Create file: routes/validators.js
const Joi = require('joi');

const complaintSchema = Joi.object({
  description: Joi.string().min(10).max(500).required(),
  category: Joi.string()
    .valid('Maintenance', 'Parking', 'Noise', 'Pest', 'Water', 'Electricity')
    .required(),
  priority: Joi.string()
    .valid('Low', 'Medium', 'High', 'Critical')
    .required()
});

const feedbackSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comments: Joi.string().min(5).max(500).required(),
  category: Joi.string()
    .valid('Management', 'Maintenance', 'Overall', 'Other')
    .required()
});

module.exports = { complaintSchema, feedbackSchema };
```

Use in routes:

```javascript
const { complaintSchema } = require('../routes/validators');

router.post('/', auth, async (req, res) => {
  const { error, value } = complaintSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation Error',
      details: error.details[0].message
    });
  }

  // ... rest of your code
});
```

---

## Step 10: Run and Test

```bash
# Install all dependencies
npm install

# Start MongoDB (in another terminal)
mongod --dbpath ./data

# Start the application
npm run dev

# Run tests
npm test

# Run load test
npm run test:load
```

---

## Verification Checklist

- [ ] All npm packages installed (`npm install` succeeds)
- [ ] MongoDB running and connected
- [ ] Server starts without errors: `npm run dev`
- [ ] Security headers present (check browser dev tools)
- [ ] Rate limiting active (make 100+ requests in 15 min to test)
- [ ] Logging showing in console
- [ ] Email service gracefully handles missing configuration
- [ ] File uploads working (check `/public/uploads/` directory)
- [ ] Tests passing: `npm test`
- [ ] Load test running: `npm run test:load`

---

## Optional Enhancements

### Enable Redis Cache (Production)
```bash
# Install Redis
# macOS: brew install redis
# Ubuntu: sudo apt-get install redis-server
# Windows: Use Docker

# Start Redis
redis-server

# Update .env
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Enable Email Notifications (Gmail)
1. Enable 2-factor authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Enable Docker Deployment
```bash
# Build image
npm run docker:build

# Run with Docker
npm run docker:run

# Or use Docker Compose (includes MongoDB & Redis)
npm run deploy:docker
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Cannot find module 'multer'` | Run `npm install` again |
| Email not sending | Check `.env` EMAIL_USER and EMAIL_PASS |
| File upload fails | Create `/public/uploads` directory |
| Rate limiting blocking requests | It's working - wait 15 minutes |
| Tests won't run | Ensure MongoDB is running on localhost:27017 |
| Redis connection error | Optional - system works without it |

---

## Next Steps

1. ✅ Update server.js with middleware
2. ✅ Add email notifications to routes
3. ✅ Add file upload handling
4. ✅ Add PDF report endpoints
5. ✅ Add caching to statistics
6. ✅ Test all features: `npm test`
7. ✅ Deploy to Docker/Azure (see DEPLOYMENT_GUIDE.md)

**Your enterprise-ready Apartment Complaint System is now complete! 🎉**
