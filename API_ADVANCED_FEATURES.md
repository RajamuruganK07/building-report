# API Documentation - Advanced Features

## 📧 Email Notification Endpoints

### Automatic Email Notifications
The system automatically sends emails for key events:

**Complaint Submission:**
- Sent to: Admin email from `.env`
- Content: User details, complaint description, category, and priority
- Trigger: When complaint is created via POST `/api/complaints`

**Feedback Submission:**
- Sent to: Complaint creator (if linked) or admin
- Content: Feedback message and rating
- Trigger: When feedback is submitted via POST `/api/feedback`

**Status Update:**
- Sent to: Complaint creator
- Content: Updated status and admin notes
- Trigger: When admin updates complaint status

**Configuration:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@apartment.com
APP_URL=http://localhost:5000
ADMIN_URL=http://localhost:5000/admin
```

---

## 📁 File Upload Endpoints

### Upload Evidence/Attachments
**POST** `/api/complaints` - Submit complaint with attachment
```javascript
Body: {
  description: string,
  category: enum,
  priority: enum,
  evidence: File (optional)
}
```

**Supported Files:**
- Images: JPG, PNG, GIF
- Documents: PDF, DOC, DOCX
- Max Size: 5MB
- Storage: `/public/uploads/`

### Download Attachment
**GET** `/api/complaints/:id/download-evidence`
- Returns uploaded evidence file for complaint
- Authorization: Required

---

## 📊 Report Generation Endpoints

### Generate Complaint Report
**GET** `/api/admin/reports/complaints`
- Returns: PDF file with all complaints, statistics, and analysis
- Authorization: Admin only
- Content: Status breakdown, category breakdown, complaint details

### Generate Feedback Report
**GET** `/api/admin/reports/feedback`
- Returns: PDF file with feedback analysis
- Authorization: Admin only
- Content: Average ratings, category breakdown, detailed feedback

**Response:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="complaints_report.pdf"
```

---

## ⚡ Caching Service

### Cache Strategy
- **Enabled by:** `REDIS_HOST` environment variable
- **Default TTL:** 1 hour (3600 seconds)
- **Fallback:** Direct database queries if Redis unavailable
- **Cached Data:**
  - Admin statistics (1 hour)
  - Complaint lists (30 minutes)
  - User complaint counts (30 minutes)

### Cache Management Endpoints (Future)
- `POST /api/admin/cache/clear` - Clear all cache
- `GET /api/admin/cache/stats` - View cache statistics

---

## 🔒 Security Features

### Rate Limiting
- **Window:** 15 minutes
- **Max Requests:** 100 per window
- **Response:** 429 Too Many Requests

Applied to:
- `/api/auth/login` - 5 attempts per 15 minutes
- `/api/auth/signup` - 3 attempts per 15 minutes
- All other endpoints - 100 attempts per 15 minutes

### Request Validation (Joi)
All POST/PUT requests validated for:
- Required fields present
- Valid data types
- Length constraints
- Email format
- Enum values

**Example Error:**
```json
{
  "error": "Validation Error",
  "details": {
    "rating": "must be between 1 and 5"
  }
}
```

### Security Headers (Helmet)
- Content Security Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HTTPS enforced in production)

---

## 📝 Logging

### Morgan HTTP Logger
All requests logged with:
- HTTP method (GET, POST, PUT, DELETE)
- Endpoint path
- Response status code
- Response time
- Request size
- Client IP

**Log Level Configuration:**
```env
LOG_LEVEL=debug  # development
LOG_LEVEL=info   # production
```

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
npm run test:api
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Load Testing
```bash
npm run test:load
```

**Test Coverage Targets:**
- Authentication: 100%
- Complaint CRUD: 100%
- Feedback submission: 100%
- Authorization checks: 100%
- Error handling: 80%+

---

## 🚀 Performance Tips

### Optimize Database Queries
```javascript
// Good - Selective projection
const complaints = await Complaint.find()
  .select('description category priority status')
  .limit(20);

// Bad - All fields returned
const complaints = await Complaint.find();
```

### Use Caching for Frequent Queries
```javascript
// Cache heavy queries
const stats = await cacheService.cacheGet('admin_stats');
if (!stats) {
  stats = await generateStats();
  await cacheService.cacheSet('admin_stats', stats, 3600);
}
```

### Index Database Collections
```javascript
// Mongoose auto-indexes:
// - _id (primary key)
// - userId (foreign key)
// Status and category queries benefit from indexing
```

---

## 🔗 Webhook Integration (Future)

**Planned webhooks:**
- `complaint.created` - Triggers when complaint submitted
- `complaint.updated` - Triggers on status change
- `feedback.submitted` - Triggers when feedback received
- `admin.action` - Triggers on admin operations

---

## 📱 Mobile App Integration

**Required Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**CORS Configuration:**
```javascript
allowedOrigins: [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://apartment-system.azure.com'
]
```

---

## 🔄 Data Sync & Offline Support

**Recommended Implementation:**
```javascript
// Local storage for offline
localStorage.setItem('lastSync', timestamp);
localStorage.setItem('pendingComplaints', JSON.stringify(complaints));

// Sync when online
if (navigator.onLine) {
  syncPendingData();
}
```

---

## 💡 Best Practices

1. **Always include JWT token in headers**
2. **Use POST for data mutation, GET for retrieval**
3. **Handle rate limiting with exponential backoff**
4. **Cache frequently accessed data**
5. **Monitor email delivery with webhook callbacks**
6. **Validate file uploads on client and server**
7. **Test with load testing before production**
8. **Enable Redis for production scalability**

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Emails not sending | Check `.env` EMAIL_USER, EMAIL_PASS, and Gmail app password |
| File uploads failing | Verify `/public/uploads/` directory exists and writable |
| Reports not generating | Ensure PDFKit is installed: `npm install pdfkit` |
| Cache not working | Check Redis running: `redis-cli ping` |
| Rate limit errors | Wait 15 minutes or restart application |
| Tests failing | Ensure MongoDB running: `mongod --dbpath ./data` |

---

**API v2.0 - Enterprise Edition Ready! 🎉**
