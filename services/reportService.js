const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateComplaintReport = async (complaints) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const filename = `complaint-report-${Date.now()}.pdf`;
      const filepath = path.join(__dirname, '../public/reports', filename);

      // Create reports directory if it doesn't exist
      const reportsDir = path.join(__dirname, '../public/reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Title
      doc.fontSize(20).text('Complaint Report', { align: 'center' });
      doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown();

      // Summary
      doc.fontSize(14).text('Summary', { underline: true });
      doc.fontSize(11).text(`Total Complaints: ${complaints.length}`);
      
      const statusCount = {};
      const categoryCount = {};
      
      complaints.forEach(c => {
        statusCount[c.status] = (statusCount[c.status] || 0) + 1;
        categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
      });

      doc.text('By Status:');
      Object.entries(statusCount).forEach(([status, count]) => {
        doc.text(`  • ${status}: ${count}`);
      });

      doc.moveDown();
      doc.text('By Category:');
      Object.entries(categoryCount).forEach(([category, count]) => {
        doc.text(`  • ${category}: ${count}`);
      });

      doc.moveDown();
      doc.fontSize(14).text('Complaints Details', { underline: true });

      // Complaints table
      complaints.forEach((complaint, index) => {
        doc.fontSize(11).text(`${index + 1}. ${complaint.category} - ${complaint.status}`, { underline: true });
        doc.fontSize(10)
          .text(`From: ${complaint.username} (${complaint.flatNumber})`)
          .text(`Priority: ${complaint.priority}`)
          .text(`Date: ${new Date(complaint.createdAt).toLocaleDateString()}`);
        
        if (complaint.description) {
          doc.text(`Description: ${complaint.description.substring(0, 100)}...`);
        }
        if (complaint.adminNotes) {
          doc.text(`Admin Notes: ${complaint.adminNotes}`);
        }
        doc.moveDown();
      });

      doc.end();

      stream.on('finish', () => {
        resolve(filename);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const generateFeedbackReport = async (feedbacks) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const filename = `feedback-report-${Date.now()}.pdf`;
      const filepath = path.join(__dirname, '../public/reports', filename);

      const reportsDir = path.join(__dirname, '../public/reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Title
      doc.fontSize(20).text('Feedback Report', { align: 'center' });
      doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown();

      // Summary
      doc.fontSize(14).text('Summary', { underline: true });
      doc.fontSize(11).text(`Total Feedback: ${feedbacks.length}`);

      const avgRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
      doc.text(`Average Rating: ${avgRating.toFixed(2)}/5 ⭐`);

      const categoryCount = {};
      feedbacks.forEach(f => {
        categoryCount[f.category] = (categoryCount[f.category] || 0) + 1;
      });

      doc.moveDown();
      doc.text('By Category:');
      Object.entries(categoryCount).forEach(([category, count]) => {
        doc.text(`  • ${category}: ${count}`);
      });

      doc.moveDown();
      doc.fontSize(14).text('Feedback Details', { underline: true });

      feedbacks.forEach((feedback, index) => {
        doc.fontSize(11).text(`${index + 1}. ${feedback.category} - Rating: ${feedback.rating}/5 ⭐`, { underline: true });
        doc.fontSize(10).text(`From: ${feedback.username}`);
        doc.text(`Date: ${new Date(feedback.createdAt).toLocaleDateString()}`);
        
        if (feedback.comments) {
          doc.text(`Feedback: ${feedback.comments.substring(0, 100)}...`);
        }
        doc.moveDown();
      });

      doc.end();

      stream.on('finish', () => {
        resolve(filename);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateComplaintReport,
  generateFeedbackReport
};
