#!/usr/bin/env node

/**
 * Seed Demo Data via API
 * Creates users, complaints, and feedback using the HTTP API
 * No direct database connection needed!
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';

// Demo users to create
const demoUsers = [
  {
    username: 'john_resident',
    email: 'john@apartment.com',
    password: 'password123',
    fullName: 'John Anderson',
    age: 35,
    doorNumber: '101',
    flatNumber: 'A1',
    mobileNumber: '9876543210'
  },
  {
    username: 'sarah_resident',
    email: 'sarah@apartment.com',
    password: 'password123',
    fullName: 'Sarah Wilson',
    age: 28,
    doorNumber: '102',
    flatNumber: 'A2',
    mobileNumber: '9876543211'
  },
  {
    username: 'priya_resident',
    email: 'priya@apartment.com',
    password: 'password123',
    fullName: 'Priya Kumar',
    age: 32,
    doorNumber: '103',
    flatNumber: 'A3',
    mobileNumber: '9876543213'
  },
  {
    username: 'david_resident',
    email: 'david@apartment.com',
    password: 'password123',
    fullName: 'David Brown',
    age: 40,
    doorNumber: '201',
    flatNumber: 'B1',
    mobileNumber: '9876543214'
  }
];

// Demo complaints
const demoComplaints = [
  {
    description: 'Unauthorized parking in my designated spot. Someone is blocking my parking area every evening.',
    category: 'Parking',
    priority: 'High'
  },
  {
    description: 'Water leakage from ceiling affecting electrical fixtures. This is urgent as it may cause safety hazards.',
    category: 'Maintenance',
    priority: 'High'
  },
  {
    description: 'Excessive noise from flat 201 late at night. Music and loud conversations disturbing sleep.',
    category: 'Noise',
    priority: 'Medium'
  },
  {
    description: 'Power cuts happening frequently in the evening. Voltage fluctuations affecting appliances.',
    category: 'Water/Electricity',
    priority: 'Medium'
  },
  {
    description: 'Broken intercom system at main gate. Guests cannot communicate with residents.',
    category: 'Security',
    priority: 'Low'
  }
];

// Demo feedback
const demoFeedback = [
  {
    rating: 4,
    comments: 'Overall management is good but response time could be faster. Happy with the community initiatives.',
    category: 'Management'
  },
  {
    rating: 5,
    comments: 'Excellent maintenance team! They fixed my issue very quickly. Keep up the good work!',
    category: 'Maintenance'
  },
  {
    rating: 4,
    comments: 'Good community spirit. Weekend events are well organized. More social activities would be great.',
    category: 'Community'
  },
  {
    rating: 3,
    comments: 'Security needs improvement. More CCTV cameras needed at parking areas.',
    category: 'Security'
  }
];

// Helper function to make HTTP requests
function makeRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + endpoint);
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(url, options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsed,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function seedViaAPI() {
  try {
    console.log('🚀 Starting API-based seed script...\n');

    // Step 1: Create users
    console.log('👥 Creating demo users...');
    const userTokens = {};
    
    for (const user of demoUsers) {
      try {
        const response = await makeRequest('POST', '/api/auth/signup', user);
        if (response.status === 201 || response.status === 200) {
          console.log(`   ✅ Created: ${user.fullName} (${user.email})`);
          if (response.data.token) {
            userTokens[user.email] = response.data.token;
          }
        } else {
          console.log(`   ⚠️  ${user.fullName}: ${response.data.message || 'Already exists'}`);
          // Try to login and get token
          const loginRes = await makeRequest('POST', '/api/auth/login', {
            email: user.email,
            password: user.password
          });
          if (loginRes.status === 200 && loginRes.data.token) {
            userTokens[user.email] = loginRes.data.token;
          }
        }
      } catch (err) {
        console.log(`   ❌ Error with ${user.fullName}: ${err.message}`);
      }
    }

    // Step 2: Create complaints
    console.log('\n📝 Creating demo complaints...');
    let complaintCount = 0;
    const userEmails = Object.keys(userTokens);
    
    for (let i = 0; i < demoComplaints.length && i < userEmails.length; i++) {
      const userEmail = userEmails[i];
      const token = userTokens[userEmail];
      
      try {
        // Make request with authorization header
        const url = new URL(BASE_URL + '/api/complaints');
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };

        const response = await new Promise((resolve) => {
          const req = http.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              resolve({
                status: res.statusCode,
                data: data ? JSON.parse(data) : {}
              });
            });
          });
          req.write(JSON.stringify(demoComplaints[i]));
          req.end();
        });

        if (response.status === 201 || response.status === 200) {
          console.log(`   ✅ Complaint ${i + 1}: ${demoComplaints[i].category}`);
          complaintCount++;
        } else {
          console.log(`   ⚠️  Complaint ${i + 1}: ${response.data.message || 'Failed'}`);
        }
      } catch (err) {
        console.log(`   ❌ Error creating complaint: ${err.message}`);
      }
    }

    // Step 3: Create feedback
    console.log('\n💬 Creating demo feedback...');
    let feedbackCount = 0;
    
    for (let i = 0; i < demoFeedback.length && i < userEmails.length; i++) {
      const userEmail = userEmails[i];
      const token = userTokens[userEmail];
      
      try {
        const url = new URL(BASE_URL + '/api/feedback');
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };

        const response = await new Promise((resolve) => {
          const req = http.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              resolve({
                status: res.statusCode,
                data: data ? JSON.parse(data) : {}
              });
            });
          });
          req.write(JSON.stringify(demoFeedback[i]));
          req.end();
        });

        if (response.status === 201 || response.status === 200) {
          console.log(`   ✅ Feedback ${i + 1}: ${demoFeedback[i].rating}⭐ - ${demoFeedback[i].category}`);
          feedbackCount++;
        } else {
          console.log(`   ⚠️  Feedback ${i + 1}: ${response.data.message || 'Failed'}`);
        }
      } catch (err) {
        console.log(`   ❌ Error creating feedback: ${err.message}`);
      }
    }

    // Summary
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('            ✨ DEMO DATA SEEDED SUCCESSFULLY ✨');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📊 Summary:');
    console.log(`   • Users Created: ${Object.keys(userTokens).length}`);
    console.log(`   • Complaints Created: ${complaintCount}`);
    console.log(`   • Feedback Created: ${feedbackCount}`);
    console.log('\n🎯 Test Accounts:\n');
    console.log('   Regular User: john@apartment.com / password123');
    console.log('   Sarah: sarah@apartment.com / password123');
    console.log('   Priya: priya@apartment.com / password123');
    console.log('   David: david@apartment.com / password123');
    console.log('\n✨ Your demo is ready! Open http://localhost:5000');
    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedViaAPI();
