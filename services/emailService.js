const nodemailer = require('nodemailer');
require('dotenv').config();

// Email service configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Send complaint notification to admin
const sendComplaintNotification = async (complaint) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || 'admin@apartment.com',
    subject: `New Complaint - ${complaint.category} (Priority: ${complaint.priority})`,
    html: `
      <h2>New Complaint Received</h2>
      <p><strong>Category:</strong> ${complaint.category}</p>
      <p><strong>Priority:</strong> ${complaint.priority}</p>
      <p><strong>From:</strong> ${complaint.username}</p>
      <p><strong>Apartment:</strong> Door ${complaint.doorNumber}, Flat ${complaint.flatNumber}</p>
      <p><strong>Contact:</strong> ${complaint.mobileNumber}</p>
      <p><strong>Description:</strong></p>
      <p>${complaint.description}</p>
      <p><strong>Submitted:</strong> ${new Date(complaint.createdAt).toLocaleString()}</p>
      <hr>
      <a href="${process.env.ADMIN_URL || 'http://localhost:5000'}/admin">View in Admin Panel</a>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Complaint notification email sent');
  } catch (error) {
    console.log('⚠️ Email service not configured (optional feature)', error.message);
  }
};

// Send feedback thank you email
const sendFeedbackThankYou = async (feedback, userEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Thank You for Your Feedback',
    html: `
      <h2>Thank You for Your Feedback!</h2>
      <p>We appreciate your feedback and will use it to improve our services.</p>
      <p><strong>Your Rating:</strong> ${feedback.rating}/5 ⭐</p>
      <p><strong>Category:</strong> ${feedback.category}</p>
      <p><strong>Submitted:</strong> ${new Date(feedback.createdAt).toLocaleString()}</p>
      <p>Thank you for being part of our community!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Thank you email sent to user');
  } catch (error) {
    console.log('⚠️ Email service not configured (optional feature)', error.message);
  }
};

// Send complaint status update
const sendStatusUpdate = async (complaint, userEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Complaint Status Updated - ${complaint.status}`,
    html: `
      <h2>Your Complaint Status Has Been Updated</h2>
      <p><strong>Status:</strong> ${complaint.status}</p>
      <p><strong>Category:</strong> ${complaint.category}</p>
      <p><strong>Updated:</strong> ${new Date(complaint.updatedAt).toLocaleString()}</p>
      ${complaint.adminNotes ? `<p><strong>Admin Notes:</strong> ${complaint.adminNotes}</p>` : ''}
      <hr>
      <a href="${process.env.APP_URL || 'http://localhost:5000'}">Check your complaints</a>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Status update email sent');
  } catch (error) {
    console.log('⚠️ Email service not configured (optional feature)', error.message);
  }
};

module.exports = {
  sendComplaintNotification,
  sendFeedbackThankYou,
  sendStatusUpdate,
  transporter
};
