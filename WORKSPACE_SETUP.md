# VS Code Workspace Setup - Quick Start Guide

## 📂 Open in VS Code

1. **Open the workspace file:**
   ```
   File → Open Workspace from File
   Select: c:\Users\ACER\bulding\apartment-complaint-system\apartment-complaint.code-workspace
   ```

2. **Install recommended extensions** when VS Code prompts you:
   - MongoDB VSCode (database management)
   - Prettier (code formatting)
   - Thunder Client (API testing)
   - ESLint (code quality)

---

## ⚙️ Development Environment Setup

### **Step 1: Install Dependencies**
```bash
Ctrl + `  (open terminal)
npm install
```
This installs all required packages (Express, MongoDB driver, etc.)

### **Step 2: Configure MongoDB**

**Option A: Local MongoDB**
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB
- `.env` is already set to `mongodb://localhost:27017/apartment-complaints`

**Option B: MongoDB Atlas (Cloud)**
- Create free account: https://www.mongodb.com/cloud/atlas
- Create cluster and get connection string
- Update `.env`:
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/apartment-complaints
  ```

### **Step 3: Start the Server**

**Option 1: From VS Code Task (Recommended)**
- Press `Ctrl + Shift + B` → Select "npm: start (server)"
- Server runs on `http://localhost:5000`

**Option 2: From Terminal**
```bash
npm start
```

**Option 3: Development with Auto-Reload**
```bash
npm run dev
```
(Uses nodemon to auto-restart on file changes)

---

## 🐛 Debugging

### **Debug Server + Browser Together**
1. Press `Ctrl + Shift + D` (Debug view)
2. Select "Server + Browser" → Click ▶️ Play
3. This launches both Node debugger and Chrome simultaneously

### **Debug Server Only**
1. Debug view → Select "Launch Server" → Click ▶️ Play
2. Set breakpoints in server code
3. Open `http://localhost:5000` in browser

---

## 🧪 Testing the Application

### **1. Test with Thunder Client (Built-in API Tester)**
- Install Thunder Client extension if not already done
- Click Thunder Client icon on left sidebar
- Use to test API endpoints (auth, complaints, feedback, admin)

### **2. Manual Testing**
1. Open `http://localhost:5000` in browser
2. **Signup** → Create resident account
3. **Submit Complaint** → Test complaint submission
4. **Share Feedback** → Test 5-star rating system
5. **Check Admin Panel** → View statistics

---

## 📁 Project Structure

```
apartment-complaint-system/
├── .vscode/
│   ├── launch.json       (Debugger config)
│   ├── tasks.json        (Build tasks)
│   └── extensions.json   (Recommended extensions)
├── public/
│   ├── css/styles.css    (Beautiful UI styling)
│   ├── js/app.js         (Frontend logic)
│   └── index.html        (Main HTML page)
├── models/
│   ├── User.js           (User schema + password hashing)
│   ├── Complaint.js      (Complaint data model)
│   └── Feedback.js       (Feedback data model)
├── routes/
│   ├── auth.js           (Login/Signup endpoints)
│   ├── complaints.js     (Complaint CRUD endpoints)
│   ├── feedback.js       (Feedback endpoints)
│   └── admin.js          (Admin dashboard endpoints)
├── middleware/
│   └── auth.js           (JWT authentication & admin check)
├── server.js             (Main Express server)
├── package.json          (Dependencies)
├── .env                  (Database & JWT config)
└── README.md             (Full documentation)
```

---

## 🎯 Common Tasks

### **Format Code with Prettier**
```bash
Ctrl + Shift + P → Format Document
```

### **Check Lint Errors**
```bash
Ctrl + Shift + P → ESLint: Show Output Channel
```

### **View Server Logs**
- Terminal shows all console logs
- Check browser DevTools (F12) for frontend logs

### **Kill Server**
- Click stop button (⏹️) in debug toolbar
- Or: `Ctrl + C` in terminal

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Port 5000 already in use** | Kill process: `netstat -ano \| findstr :5000` then `taskkill /PID` |
| **MongoDB connection error** | Check `.env` - ensure MongoDB is running |
| **Dependencies missing** | Run `npm install` again |
| **Can't open workspace file** | Drag-drop `.code-workspace` file into VS Code |
| **Extensions not installing** | Click "Install" in extensions panel when prompted |

---

## 🎬 Presentation Demo Flow

1. **Show Features**: Sign up → Submit complaint → Feedback → Track status
2. **Admin Panel**: Show statistics → Update complaint status → Add notes
3. **Code Structure**: Explain models, routes, middleware
4. **API Demo**: Use Thunder Client to show API requests/responses
5. **Database**: Show MongoDB entries with MongoDB VSCode extension

---

## 📝 Quick Commands Reference

```bash
npm install              # Install all dependencies
npm start               # Start server (production mode)
npm run dev             # Start with auto-reload (development)
Ctrl + Shift + B        # Run build task
Ctrl + Shift + D        # Open Debug view
Ctrl + `                # Toggle terminal
F5                      # Start debugging
Ctrl + Shift + P        # Command palette
```

---

**Ready to go! Open the workspace and start developing.** 🚀
