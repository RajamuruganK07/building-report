# Apartment Complaint & Management System

A complete full-stack web application for managing residential complaints and feedback in apartment complexes.

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally or cloud connection)
- npm

### Steps

1. **Navigate to project directory:**
   ```bash
   cd apartment-complaint-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure MongoDB:**
   - Update `.env` file with your MongoDB connection string
   - Default: `mongodb://localhost:27017/apartment-complaints`
   - For MongoDB Atlas, replace with your connection string

4. **Start the server:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Open browser and go to `http://localhost:5000`

## Features

### 🏠 Resident Features
- **User Authentication**: Secure signup and login with JWT
- **Submit Complaints**: Register issues with category, priority, and description
- **View Status**: Track complaint status (Pending, In Progress, Resolved, Closed)
- **Share Feedback**: Provide ratings and suggestions anytime, anonymously if preferred
- **My Complaints**: View all submitted complaints with status updates

### ⚙️ Admin Features
- **Dashboard**: Real-time statistics on complaints and feedback
- **Manage Complaints**: Update status, add notes, set priority levels
- **Review Feedback**: View all resident feedback and ratings
- **Track Metrics**: Monitor pending issues, resolution rates, user satisfaction

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing

## Project Structure

```
apartment-complaint-system/
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── models/
│   ├── User.js
│   ├── Complaint.js
│   └── Feedback.js
├── routes/
│   ├── auth.js
│   ├── complaints.js
│   ├── feedback.js
│   └── admin.js
├── middleware/
│   └── auth.js
├── server.js
├── package.json
├── .env
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Complaints
- `POST /api/complaints` - Submit complaint
- `GET /api/complaints/my-complaints` - Get user's complaints
- `GET /api/complaints/:id` - Get specific complaint
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/my-feedback` - Get user's feedback

### Admin
- `GET /api/admin/complaints` - Get all complaints
- `PUT /api/admin/complaints/:id` - Update complaint status
- `GET /api/admin/feedback` - Get all feedback
- `GET /api/admin/stats` - Get dashboard statistics

## Usage Guide

### For Residents
1. **Sign Up**: Create account with your apartment details
2. **Submit Complaint**: Go to "Submit Complaint" section
3. **Choose Category**: Select issue type (Parking, Maintenance, Noise, etc.)
4. **Set Priority**: Indicate urgency level
5. **Describe Issue**: Provide detailed description
6. **Track Status**: Check "My Complaints" for updates
7. **Share Feedback**: Use feedback section for suggestions

### For Admins
1. **Login**: Use admin account credentials
2. **View Dashboard**: See system statistics
3. **Review Complaints**: Check all submitted issues
4. **Update Status**: Change complaint progress status
5. **Add Notes**: Provide feedback to residents
6. **Monitor Ratings**: View resident satisfaction scores

## Default Admin Account
To create an admin account, modify the signup request in the database to set `isAdmin: true`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `.env` file for correct connection string
- Verify firewall allows connection

### API Not Responding
- Check if server is running on port 5000
- Check browser console for errors
- Verify all dependencies are installed

### Login Issues
- Clear browser cache/cookies
- Check if user exists
- Verify password is correct

## Future Enhancements
- Complaint status notifications
- Mobile app support
- Image/file upload for issues
- SMS notifications
- Scheduled maintenance calendar
- Community forum
- Advanced analytics dashboard

## License
ISC

---
**Developed for the Apartment Management System Presentation**
