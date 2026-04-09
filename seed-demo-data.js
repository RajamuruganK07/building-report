#!/usr/bin/env node

/**
 * Demo Data Seed Script
 * Creates sample users, complaints, and feedback for testing
 * Run: node seed-demo-data.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Complaint = require('./models/Complaint');
const Feedback = require('./models/Feedback');

// Sample Data
const sampleUsers = [
  {
    username: 'john_resident',
    email: 'john@apartment.com',
    password: 'password123',
    fullName: 'John Anderson',
    age: 35,
    doorNumber: '101',
    flatNumber: 'A1',
    mobileNumber: '9876543210',
    isAdmin: false
  },
  {
    username: 'sarah_resident',
    email: 'sarah@apartment.com',
    password: 'password123',
    fullName: 'Sarah Wilson',
    age: 28,
    doorNumber: '102',
    flatNumber: 'A2',
    mobileNumber: '9876543211',
    isAdmin: false
  },
  {
    username: 'mike_admin',
    email: 'admin@apartment.com',
    password: 'admin123',
    fullName: 'Mike Johnson',
    age: 45,
    doorNumber: 'ADMIN',
    flatNumber: 'ADMIN',
    mobileNumber: '9876543212',
    isAdmin: true
  },
  {
    username: 'priya_resident',
    email: 'priya@apartment.com',
    password: 'password123',
    fullName: 'Priya Kumar',
    age: 32,
    doorNumber: '103',
    flatNumber: 'A3',
    mobileNumber: '9876543213',
    isAdmin: false
  },
  {
    username: 'david_resident',
    email: 'david@apartment.com',
    password: 'password123',
    fullName: 'David Brown',
    age: 40,
    doorNumber: '201',
    flatNumber: 'B1',
    mobileNumber: '9876543214',
    isAdmin: false
  }
];

const sampleComplaints = [
  {
    username: 'john_resident',
    age: 35,
    doorNumber: '101',
    flatNumber: 'A1',
    mobileNumber: '9876543210',
    description: 'Unauthorized parking in my designated spot. Someone is blocking my parking area every evening.',
    category: 'Parking',
    status: 'Pending',
    priority: 'High',
    adminNotes: ''
  },
  {
    username: 'sarah_resident',
    age: 28,
    doorNumber: '102',
    flatNumber: 'A2',
    mobileNumber: '9876543211',
    description: 'Water leakage from ceiling affecting electrical fixtures. This is urgent as it may cause safety hazards.',
    category: 'Maintenance',
    status: 'In Progress',
    priority: 'High',
    adminNotes: 'Technician assigned. Will visit tomorrow at 10 AM.'
  },
  {
    username: 'priya_resident',
    age: 32,
    doorNumber: '103',
    flatNumber: 'A3',
    mobileNumber: '9876543213',
    description: 'Excessive noise from flat 201 late at night. Music and loud conversations disturbing sleep.',
    category: 'Noise',
    status: 'Resolved',
    priority: 'Medium',
    adminNotes: 'Spoke with resident. They agreed to reduce noise levels.'
  },
  {
    username: 'david_resident',
    age: 40,
    doorNumber: '201',
    flatNumber: 'B1',
    mobileNumber: '9876543214',
    description: 'Power cuts happening frequently in the evening. Voltage fluctuations affecting appliances.',
    category: 'Water/Electricity',
    status: 'In Progress',
    priority: 'Medium',
    adminNotes: 'Electrician inspecting main switch board tomorrow.'
  },
  {
    username: 'john_resident',
    age: 35,
    doorNumber: '101',
    flatNumber: 'A1',
    mobileNumber: '9876543210',
    description: 'Broken intercom system at main gate. Guests cannot communicate with residents.',
    category: 'Security',
    status: 'Pending',
    priority: 'Low',
    adminNotes: ''
  }
];

const sampleFeedback = [
  {
    username: 'john_resident',
    rating: 4,
    comments: 'Overall management is good but response time could be faster. Happy with the community initiatives.',
    category: 'Management',
    isAnonymous: false
  },
  {
    username: 'sarah_resident',
    rating: 5,
    comments: 'Excellent maintenance team! They fixed my issue very quickly. Keep up the good work!',
    category: 'Maintenance',
    isAnonymous: false
  },
  {
    username: 'Anonymous',
    rating: 3,
    comments: 'Security needs improvement. More CCTV cameras needed at parking areas.',
    category: 'Security',
    isAnonymous: true
  },
  {
    username: 'priya_resident',
    rating: 4,
    comments: 'Good community spirit. Weekend events are well organized. More social activities would be great.',
    category: 'Community',
    isAnonymous: false
  },
  {
    username: 'david_resident',
    rating: 2,
    comments: 'Water supply is inconsistent. Frequent breakdowns affect daily life. Please address this urgently.',
    category: 'Other',
    isAnonymous: false
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Complaint.deleteMany({});
    await Feedback.deleteMany({});
    console.log('✅ Data cleared');

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.create(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create complaints
    console.log('📝 Creating complaints...');
    const userMap = {};
    createdUsers.forEach(user => {
      userMap[user.username] = user._id;
    });

    const complaintData = sampleComplaints.map(complaint => ({
      ...complaint,
      userId: userMap[complaint.username]
    }));

    const createdComplaints = await Complaint.create(complaintData);
    console.log(`✅ Created ${createdComplaints.length} complaints`);

    // Create feedback
    console.log('💬 Creating feedback...');
    const feedbackData = sampleFeedback.map(feedback => ({
      ...feedback,
      userId: feedback.username === 'Anonymous' ? userMap['john_resident'] : userMap[feedback.username]
    }));

    const createdFeedback = await Feedback.create(feedbackData);
    console.log(`✅ Created ${createdFeedback.length} feedback entries`);

    // Print credentials
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('            🎉 DEMO DATA CREATED SUCCESSFULLY 🎉');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📋 TEST ACCOUNTS:\n');
    console.log('👤 Regular User:');
    console.log('   Email: john@apartment.com');
    console.log('   Password: password123');
    console.log('\n⚙️ Admin User:');
    console.log('   Email: admin@apartment.com');
    console.log('   Password: admin123\n');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('📊 Statistics:');
    console.log(`   • Total Users: ${createdUsers.length}`);
    console.log(`   • Total Complaints: ${createdComplaints.length}`);
    console.log(`   • Total Feedback: ${createdFeedback.length}`);
    console.log('\n✨ Ready to test! Start the server with: npm start\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
