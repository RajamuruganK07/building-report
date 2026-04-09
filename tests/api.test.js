/**
 * Test Suite for Apartment Complaint System
 * Run: npm test
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Feedback = require('../models/Feedback');

// Test User Data
const testUser = {
  username: 'testuser123',
  email: 'test@apartment.com',
  password: 'Test@12345',
  fullName: 'Test User',
  mobileNumber: '9999999999'
};

let authToken;
let testComplaintId;

describe('Authentication Routes', () => {
  beforeAll(async () => {
    // Clear test data
    await User.deleteMany({ email: testUser.email });
  });

  test('POST /api/auth/signup - Should create new user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe(testUser.email);
  });

  test('POST /api/auth/login - Should login user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    authToken = response.body.token;
  });

  test('POST /api/auth/login - Should fail with wrong password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
  });
});

describe('Complaint Routes', () => {
  test('POST /api/complaints - Should submit complaint', async () => {
    const complaintData = {
      description: 'Test complaint for parking issue',
      category: 'Parking',
      priority: 'High'
    };

    const response = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${authToken}`)
      .send(complaintData);

    expect(response.status).toBe(201);
    expect(response.body.complaint).toHaveProperty('_id');
    testComplaintId = response.body.complaint._id;
  });

  test('GET /api/complaints/my-complaints - Should get user complaints', async () => {
    const response = await request(app)
      .get('/api/complaints/my-complaints')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /api/complaints/:id - Should get specific complaint', async () => {
    const response = await request(app)
      .get(`/api/complaints/${testComplaintId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body._id.toString()).toBe(testComplaintId.toString());
  });

  test('POST /api/complaints - Should fail without token', async () => {
    const response = await request(app)
      .post('/api/complaints')
      .send({
        description: 'Test',
        category: 'Maintenance'
      });

    expect(response.status).toBe(401);
  });
});

describe('Feedback Routes', () => {
  test('POST /api/feedback - Should submit feedback', async () => {
    const feedbackData = {
      rating: 5,
      comments: 'Great service! Very helpful management team.',
      category: 'Management'
    };

    const response = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${authToken}`)
      .send(feedbackData);

    expect(response.status).toBe(201);
    expect(response.body.feedback.rating).toBe(5);
  });

  test('POST /api/feedback - Should validate rating between 1-5', async () => {
    const response = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        rating: 10, // Invalid rating
        comments: 'Test feedback',
        category: 'Management'
      });

    expect(response.status).toBe(400);
  });
});

describe('Admin Routes', () => {
  let adminToken;

  beforeAll(async () => {
    // Create admin user
    const adminUser = new User({
      ...testUser,
      username: 'admintest',
      email: 'admin-test@apartment.com',
      isAdmin: true
    });
    await adminUser.save();

    // Login as admin
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin-test@apartment.com',
        password: testUser.password
      });

    adminToken = response.body.token;
  });

  test('GET /api/admin/complaints - Should get all complaints (admin only)', async () => {
    const response = await request(app)
      .get('/api/admin/complaints')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /api/admin/stats - Should get statistics', async () => {
    const response = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalComplaints');
  });

  test('GET /api/admin/complaints - Should fail without admin role', async () => {
    const response = await request(app)
      .get('/api/admin/complaints')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(403);
  });
});

afterAll(async () => {
  // Cleanup
  await User.deleteMany({ email: { $regex: testUser.email } });
  await mongoose.connection.close();
});

module.exports = {};
