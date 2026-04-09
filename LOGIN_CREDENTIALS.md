# LOGIN CREDENTIALS & ADMIN SETUP GUIDE

## 🔑 TEST ACCOUNTS (Pre-created with `seed-demo-data.js`)

### Regular Users

| Username | Email | Password | Role | Apartment |
|----------|-------|----------|------|-----------|
| john_resident | john@apartment.com | password123 | User | Door 101, Flat A1 |
| sarah_resident | sarah@apartment.com | password123 | User | Door 102, Flat A2 |
| priya_resident | priya@apartment.com | password123 | User | Door 103, Flat A3 |
| david_resident | david@apartment.com | password123 | User | Door 201, Flat B1 |

### Admin Account

| Username | Email | Password | Role |
|----------|-------|----------|------|
| mike_admin | admin@apartment.com | admin123 | Admin |

---

## 🚀 GETTING STARTED

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up MongoDB
Choose one option:

**Option A: Local MongoDB**
- Download: https://www.mongodb.com/try/download/community
- Install and start MongoDB
- Connection string in `.env`: `mongodb://localhost:27017/apartment-complaints`

**Option B: MongoDB Atlas (Cloud)**
- Create free account: https://www.mongodb.com/cloud/atlas
- Create cluster
- Get connection string
- Update `.env` file with your connection string

### Step 3: Create Demo Data
```bash
node seed-demo-data.js
```

This will:
- ✅ Create 5 test users (4 residents + 1 admin)
- ✅ Create 5 sample complaints with different statuses
- ✅ Create 5 feedback entries with ratings
- ✅ Display test credentials in the terminal

### Step 4: Start the Server
**Option 1 - Using Quick Start Script:**
```bash
# Windows
quick-start.bat

# macOS/Linux
chmod +x quick-start.sh
./quick-start.sh
```

**Option 2 - Manual Start:**
```bash
npm start
```

**Option 3 - Development Mode (with auto-reload):**
```bash
npm run dev
```

### Step 5: Access the Application
Open browser and go to: **http://localhost:5000**

---

## 👤 HOW TO LOGIN AS DIFFERENT USERS

### Login as Regular Resident

1. Click **"Login"** tab
2. Enter:
   - **Email:** `john@apartment.com`
   - **Password:** `password123`
3. Click **"Login"** button
4. You're logged in! Now you can:
   - ✅ Submit complaints
   - ✅ Share feedback
   - ✅ Track your complaint status

### Login as Admin (Management)

1. Click **"Logout"** (if logged in as resident)
2. Click **"Login"** tab
3. Enter:
   - **Email:** `admin@apartment.com`
   - **Password:** `admin123`
4. Click **"Login"** button
5. You're logged in as admin! You can now:
   - ✅ View all complaints
   - ✅ Update complaint status
   - ✅ Add admin notes
   - ✅ View all feedback
   - ✅ See dashboard statistics

---

## 📊 DEMO DATA INCLUDED

When you run `seed-demo-data.js`, the following demo data is created:

### Sample Complaints
1. **Parking Issue** (John) - Status: Pending, Priority: High
2. **Water Leakage** (Sarah) - Status: In Progress, Priority: High
3. **Noise Complaint** (Priya) - Status: Resolved, Priority: Medium
4. **Power Issues** (David) - Status: In Progress, Priority: Medium
5. **Broken Intercom** (John) - Status: Pending, Priority: Low

### Sample Feedback
1. John - 4⭐ - Management feedback
2. Sarah - 5⭐ - Maintenance feedback
3. Anonymous - 3⭐ - Security feedback
4. Priya - 4⭐ - Community feedback
5. David - 2⭐ - General feedback

### Statistics
- **Total Users:** 5
- **Total Complaints:** 5
- **Total Feedback:** 5
- **Pending Complaints:** 2
- **Resolved Complaints:** 1
- **Average Rating:** 3.6/5

---

## 🎬 PRESENTATION FLOW

### 1. Start with Resident
- Login as `john@apartment.com` : `password123`
- Show submitting a complaint
- Show feedback submission
- Show tracking complaint status

### 2. Switch to Admin
- Logout and login as `admin@apartment.com` : `admin123`
- Show dashboard statistics
- Show all complaints
- Demonstrate updating complaint status
- Show all feedback
- Show average ratings

---

## ⚙️ CREATING YOUR OWN ADMIN ACCOUNT

If you want to create a custom admin account:

### Option 1: Using Mongo Shell
```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/apartment-complaints

# Find the user you want to make admin
db.users.findOne({email: "your-email@example.com"})

# Update to make them admin
db.users.updateOne(
  {email: "your-email@example.com"},
  {$set: {isAdmin: true}}
)

# Verify
db.users.findOne({email: "your-email@example.com"})
```

### Option 2: Using MongoDB VSCode Extension
1. Install MongoDB extension in VS Code
2. Connect to your MongoDB
3. Navigate to `apartment-complaints` → `users` collection
4. Find your user document
5. Edit and set `isAdmin: true`
6. Save

### Option 3: Manual Database Edit
1. Signup as a new user normally
2. Go to MongoDB & find your user by email
3. Change `isAdmin` from `false` to `true`
4. Logout and login again

---

## 🔍 TESTING WITHOUT DEMO DATA

If you prefer to test without pre-populated data:

1. **Skip the seed script:**
   ```bash
   npm start
   ```

2. **Signup new accounts:**
   - Go to http://localhost:5000
   - Click "Sign Up"
   - Create resident account
   - Create second resident account

3. **Make one admin:**
   - Use MongoDB to set `isAdmin: true` for one user

4. **Test the flow:**
   - Submit complaints as resident
   - Manage as admin

---

## 🐛 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| **"Cannot connect to MongoDB"** | Start MongoDB service or check connection string in `.env` |
| **"Port 5000 already in use"** | Kill process using port 5000 or change PORT in `.env` |
| **"Admin button not showing"** | Make sure user has `isAdmin: true` in database |
| **"Seed script fails"** | Ensure MongoDB is running and connection string is correct |
| **"Changes not showing"** | Clear browser cache (Ctrl+Shift+Delete) and refresh |

---

## 📝 QUICK REFERENCE

```
RESIDENT
┌─────────────────────────┐
│ Email: john@apartment   │
│ Password: password123   │
├─────────────────────────┤
│ ✓ Submit Complaints     │
│ ✓ Share Feedback        │
│ ✓ Track Status          │
└─────────────────────────┘

ADMIN
┌─────────────────────────┐
│ Email: admin@apartment  │
│ Password: admin123      │
├─────────────────────────┤
│ ✓ View All Data         │
│ ✓ Manage Everything     │
│ ✓ Update Status         │
│ ✓ View Statistics       │
└─────────────────────────┘
```

---

**Ready to demo! 🎉 Login and start testing the system!**
