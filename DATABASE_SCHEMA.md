# 🔧 DATABASE SCHEMA DIAGRAMS & DOCUMENTATION

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────┐
│           USER                  │
├─────────────────────────────────┤
│ PK: _id (ObjectID)              │
│ UK: username (Unique)           │
│ UK: email (Unique)              │
├─────────────────────────────────┤
│ password (Hashed)               │
│ fullName                        │
│ age                             │
│ doorNumber                      │
│ flatNumber                      │
│ mobileNumber                    │
│ isAdmin (Boolean)               │
│ createdAt (DateTime)            │
└─────────────────────────────────┘
         │
         ├──────(1:M)──────┐
         │                 │
         ▼                 ▼
    ┌─────────────┐  ┌──────────────┐
    │ COMPLAINT   │  │  FEEDBACK    │
    ├─────────────┤  ├──────────────┤
    │ PK: _id     │  │ PK: _id      │
    │ FK: userId  │  │ FK: userId   │
    ├─────────────┤  ├──────────────┤
    │ username    │  │ username     │
    │ age         │  │ rating (1-5) │
    │ doorNumber  │  │ comments     │
    │ flatNumber  │  │ category     │
    │ description │  │ isAnonymous  │
    │ category    │  │ createdAt    │
    │ status      │  └──────────────┘
    │ priority    │
    │ adminNotes  │
    │ createdAt   │
    │ updatedAt   │
    └─────────────┘
```

---

## USER Collection

### Purpose
Stores resident and admin user accounts with authentication data.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectID | Yes | MongoDB auto-generated unique ID |
| `username` | String | Yes | Unique username for login |
| `email` | String | Yes | Unique email address |
| `password` | String | Yes | Hashed password (bcryptjs) |
| `fullName` | String | Yes | User's full name |
| `age` | Number | No | User's age |
| `doorNumber` | String | No | Apartment door/unit number |
| `flatNumber` | String | No | Apartment flat number |
| `mobileNumber` | String | Yes | Contact phone number |
| `isAdmin` | Boolean | No | Admin role flag (default: false) |
| `createdAt` | DateTime | No | Account creation timestamp |

### Example Document

```json
{
  "_id": ObjectID("507f1f77bcf86cd799439011"),
  "username": "john_resident",
  "email": "john@apartment.com",
  "password": "$2a$10$encrypted_hash_string...",
  "fullName": "John Anderson",
  "age": 35,
  "doorNumber": "101",
  "flatNumber": "A1",
  "mobileNumber": "9876543210",
  "isAdmin": false,
  "createdAt": ISODate("2024-04-09T10:00:00Z")
}
```

### Indexes
- `username` (UNIQUE)
- `email` (UNIQUE)

---

## COMPLAINT Collection

### Purpose
Stores all complaints submitted by residents with tracking and admin notes.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectID | Yes | MongoDB auto-generated unique ID |
| `userId` | ObjectID (FK) | Yes | Reference to User who submitted |
| `username` | String | Yes | Username (denormalized for easy access) |
| `age` | Number | No | User's age at time of complaint |
| `doorNumber` | String | Yes | Apartment door number |
| `flatNumber` | String | Yes | Apartment flat number |
| `mobileNumber` | String | Yes | Contact number |
| `description` | String | Yes | Detailed complaint description (min: 10 chars) |
| `category` | String | Yes | Issue category (Enum: Parking, Maintenance, Noise, Water/Electricity, Security, Other) |
| `status` | String | No | Current status (Enum: Pending, In Progress, Resolved, Closed) |
| `priority` | String | No | Priority level (Enum: Low, Medium, High) |
| `adminNotes` | String | No | Notes added by admin |
| `createdAt` | DateTime | Yes | When complaint was submitted |
| `updatedAt` | DateTime | Yes | Last update timestamp |

### Example Document

```json
{
  "_id": ObjectID("507f1f77bcf86cd799439012"),
  "userId": ObjectID("507f1f77bcf86cd799439011"),
  "username": "john_resident",
  "age": 35,
  "doorNumber": "101",
  "flatNumber": "A1",
  "mobileNumber": "9876543210",
  "description": "Unauthorized parking in my designated spot every evening",
  "category": "Parking",
  "status": "In Progress",
  "priority": "High",
  "adminNotes": "Assigned to security. Will monitor parking area.",
  "createdAt": ISODate("2024-04-09T10:30:00Z"),
  "updatedAt": ISODate("2024-04-09T14:30:00Z")
}
```

### Indexes
- `userId` (for filtering by user)
- `status` (for filtering by status)
- `createdAt` (for sorting by date)
- `category` (for filtering by category)

---

## FEEDBACK Collection

### Purpose
Stores resident feedback, ratings, and suggestions for apartment management.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectID | Yes | MongoDB auto-generated unique ID |
| `userId` | ObjectID (FK) | Yes | Reference to User who gave feedback |
| `username` | String | Yes | Username (or "Anonymous") |
| `rating` | Number | Yes | Rating 1-5 stars (min: 1, max: 5) |
| `comments` | String | Yes | Feedback comments (min: 10 chars) |
| `category` | String | Yes | Feedback category (Enum: Management, Maintenance, Security, Community, Other) |
| `isAnonymous` | Boolean | No | Anonymous submission flag (default: false) |
| `createdAt` | DateTime | Yes | When feedback was submitted |

### Example Document

```json
{
  "_id": ObjectID("507f1f77bcf86cd799439013"),
  "userId": ObjectID("507f1f77bcf86cd799439011"),
  "username": "john_resident",
  "rating": 4,
  "comments": "Overall management is good. Response time could be faster.",
  "category": "Management",
  "isAnonymous": false,
  "createdAt": ISODate("2024-04-09T10:35:00Z")
}
```

### Example Anonymous Feedback

```json
{
  "_id": ObjectID("507f1f77bcf86cd799439014"),
  "userId": ObjectID("507f1f77bcf86cd799439011"),
  "username": "Anonymous",
  "rating": 3,
  "comments": "Security needs more CCTV cameras in parking area",
  "category": "Security",
  "isAnonymous": true,
  "createdAt": ISODate("2024-04-09T11:00:00Z")
}
```

### Indexes
- `userId` (for filtering by user)
- `rating` (for filtering by rating)
- `createdAt` (for sorting by date)

---

## RELATIONSHIPS

### User → Complaints (One-to-Many)
- One user can submit multiple complaints
- `Complaint.userId` references `User._id`
- Used to display "My Complaints" for residents

### User → Feedback (One-to-Many)
- One user can provide multiple feedback entries
- `Feedback.userId` references `User._id`
- Used to display "My Feedback" for residents

### Admin → All Data (Power User)
- Admins can view and manage all complaints and feedback
- No direct relationship; filtered by `isAdmin` flag

---

## DATA CONSTRAINTS & VALIDATION

### User Collection
```javascript
{
  username: { type: String, required: true, unique: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  mobileNumber: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
}
```

### Complaint Collection
```javascript
{
  description: { type: String, required: true, minlength: 10 },
  category: { type: String, enum: ['Parking', 'Maintenance', 'Noise', ...] },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved', 'Closed'] },
  priority: { type: String, enum: ['Low', 'Medium', 'High'] }
}
```

### Feedback Collection
```javascript
{
  rating: { type: Number, required: true, min: 1, max: 5 },
  comments: { type: String, required: true, minlength: 10 },
  category: { type: String, enum: ['Management', 'Maintenance', ...] }
}
```

---

## SAMPLE QUERIES

### Get User's Complaints
```javascript
db.complaints.find({ userId: ObjectID("507f1f77bcf86cd799439011") })
```

### Find Pending Complaints
```javascript
db.complaints.find({ status: "Pending" })
```

### Calculate Average Rating
```javascript
db.feedback.aggregate([
  { $group: { _id: null, avgRating: { $avg: "$rating" } } }
])
```

### Count by Category
```javascript
db.complaints.aggregate([
  { $group: { _id: "$category", count: { $sum: 1 } } }
])
```

### Find High Priority Issues
```javascript
db.complaints.find({ priority: "High", status: { $ne: "Closed" } })
```

---

## PERFORMANCE CONSIDERATIONS

1. **Indexing** - Indexes on frequently queried fields (userId, status, createdAt)
2. **Denormalization** - Store username in complaints for easy display without joining
3. **Pagination** - Large result sets should be paginated
4. **Aggregation** - Use MongoDB aggregation pipeline for complex analytics
5. **TTL Indexes** (Optional) - Auto-delete old closed complaints after 6 months

---

## FUTURE SCHEMA ENHANCEMENTS

1. **Attachments** - Add image/file storage URLs to complaints
2. **Comments** - Sub-comments on complaints for communication
3. **Tags** - Custom tags for better categorization
4. **Audit Log** - Track all changes for compliance
5. **Notifications** - Store notification preferences
6. **Escalation** - Track complaint escalation history
7. **History** - Keep backup of status changes over time

---

**End of Database Schema Documentation**
