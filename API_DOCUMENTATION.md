# API DOCUMENTATION

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except signup/login) require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## 🔐 AUTHENTICATION ENDPOINTS

### 1. Sign Up (Create Account)
**POST** `/auth/signup`

**Request Body:**
```json
{
  "username": "john_resident",
  "email": "john@apartment.com",
  "password": "password123",
  "fullName": "John Anderson",
  "age": 35,
  "doorNumber": "101",
  "flatNumber": "A1",
  "mobileNumber": "9876543210"
}
```

**Response (201 - Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_resident",
    "email": "john@apartment.com",
    "fullName": "John Anderson"
  }
}
```

**Error (400 - Bad Request):**
```json
{
  "message": "Username or email already exists"
}
```

---

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@apartment.com",
  "password": "password123"
}
```

**Response (200 - OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_resident",
    "email": "john@apartment.com",
    "fullName": "John Anderson",
    "isAdmin": false
  }
}
```

**Error (401 - Unauthorized):**
```json
{
  "message": "Invalid password"
}
```

---

## 📝 COMPLAINT ENDPOINTS

### 3. Submit Complaint
**POST** `/complaints`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "description": "Unauthorized parking in my designated spot",
  "category": "Parking",
  "priority": "High"
}
```

**Categories:** Parking, Maintenance, Noise, Water/Electricity, Security, Other  
**Priorities:** Low, Medium, High

**Response (201 - Created):**
```json
{
  "message": "Complaint submitted successfully",
  "complaint": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "username": "john_resident",
    "description": "Unauthorized parking in my designated spot",
    "category": "Parking",
    "status": "Pending",
    "priority": "High",
    "createdAt": "2024-04-09T10:30:00.000Z",
    "updatedAt": "2024-04-09T10:30:00.000Z"
  }
}
```

---

### 4. Get My Complaints
**GET** `/complaints/my-complaints`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 - OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "username": "john_resident",
    "description": "Unauthorized parking in my designated spot",
    "category": "Parking",
    "status": "Pending",
    "priority": "High",
    "createdAt": "2024-04-09T10:30:00.000Z"
  }
]
```

---

### 5. Get Single Complaint
**GET** `/complaints/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 - OK):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "username": "john_resident",
  "description": "Unauthorized parking in my designated spot",
  "category": "Parking",
  "status": "Pending",
  "priority": "High",
  "adminNotes": "",
  "createdAt": "2024-04-09T10:30:00.000Z"
}
```

---

### 6. Update Complaint
**PUT** `/complaints/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "description": "Updated complaint description",
  "category": "Maintenance",
  "priority": "Medium"
}
```

**Response (200 - OK):**
```json
{
  "message": "Complaint updated successfully",
  "complaint": { ... }
}
```

---

### 7. Delete Complaint
**DELETE** `/complaints/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 - OK):**
```json
{
  "message": "Complaint deleted successfully"
}
```

---

## 💬 FEEDBACK ENDPOINTS

### 8. Submit Feedback
**POST** `/feedback`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 4,
  "comments": "Good service but response time could be faster",
  "category": "Management",
  "isAnonymous": false
}
```

**Categories:** Management, Maintenance, Security, Community, Other

**Response (201 - Created):**
```json
{
  "message": "Feedback submitted successfully",
  "feedback": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "username": "john_resident",
    "rating": 4,
    "comments": "Good service but response time could be faster",
    "category": "Management",
    "isAnonymous": false,
    "createdAt": "2024-04-09T10:35:00.000Z"
  }
}
```

---

### 9. Get My Feedback
**GET** `/feedback/my-feedback`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 - OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "username": "john_resident",
    "rating": 4,
    "comments": "Good service but response time could be faster",
    "category": "Management",
    "isAnonymous": false,
    "createdAt": "2024-04-09T10:35:00.000Z"
  }
]
```

---

## ⚙️ ADMIN ENDPOINTS

### 10. Get All Complaints (Admin Only)
**GET** `/admin/complaints`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 - OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "username": "john_resident",
    "description": "Unauthorized parking in my designated spot",
    "category": "Parking",
    "status": "Pending",
    "priority": "High",
    "mobileNumber": "9876543210",
    "doorNumber": "101",
    "flatNumber": "A1"
  }
]
```

---

### 11. Update Complaint Status (Admin Only)
**PUT** `/admin/complaints/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "In Progress",
  "priority": "High",
  "adminNotes": "Assigned to maintenance team"
}
```

**Status Values:** Pending, In Progress, Resolved, Closed

**Response (200 - OK):**
```json
{
  "message": "Complaint status updated",
  "complaint": { ... }
}
```

---

### 12. Get All Feedback (Admin Only)
**GET** `/admin/feedback`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 - OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "username": "john_resident",
    "rating": 4,
    "comments": "Good service but response time could be faster",
    "category": "Management",
    "isAnonymous": false
  }
]
```

---

### 13. Get Dashboard Statistics (Admin Only)
**GET** `/admin/stats`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 - OK):**
```json
{
  "totalComplaints": 5,
  "pendingComplaints": 2,
  "resolvedComplaints": 1,
  "totalFeedback": 4,
  "totalUsers": 5,
  "avgRating": 3.75
}
```

---

## 🧪 TESTING WITH THUNDER CLIENT

### Example: Login and Get Token
1. **POST** to `http://localhost:5000/api/auth/login`
2. Body:
```json
{
  "email": "john@apartment.com",
  "password": "password123"
}
```
3. Copy the `token` from response
4. For next requests, set header: `Authorization: Bearer <token>`

### Example: Submit Complaint
1. **POST** to `http://localhost:5000/api/complaints`
2. Headers: `Authorization: Bearer <your_token>`
3. Body:
```json
{
  "description": "Parking issue in lot B",
  "category": "Parking",
  "priority": "High"
}
```

---

## ❌ ERROR RESPONSES

### 401 - Unauthorized
```json
{
  "message": "Access token required"
}
```

### 403 - Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 - Not Found
```json
{
  "message": "Complaint not found"
}
```

### 500 - Server Error
```json
{
  "message": "Error submitting complaint",
  "error": "error details"
}
```

---

## 📱 TEST ACCOUNTS

**Regular User:**
- Email: `john@apartment.com`
- Password: `password123`

**Admin User:**
- Email: `admin@apartment.com`
- Password: `admin123`

Run `node seed-demo-data.js` to create test data.

---

**Happy Testing! 🚀**
