// API Base URL
const API_BASE = 'http://localhost:5000/api';

let currentUser = null;
let currentRating = 0;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    currentUser = JSON.parse(user);
    updateUIAfterLogin();
    populateComplaintAutoFields();
    showSection('quickAccess');
  } else {
    showSection('quickAccess');
  }
});

async function handleQuickLogin(event) {
  event.preventDefault();

  const identifier = document.getElementById('quickUsername').value.trim();
  const password = document.getElementById('quickPassword').value;
  const messageDiv = document.getElementById('quickMessage');

  if (!identifier || !password) {
    messageDiv.textContent = 'Please fill in all required fields';
    messageDiv.className = 'error';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: identifier, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      currentUser = data.user;

      messageDiv.textContent = 'Login successful';
      messageDiv.className = 'success';

      setTimeout(() => {
        updateUIAfterLogin();
        populateComplaintAutoFields();
        showSection('dashboard');
        document.getElementById('quickAccessForm').reset();
      }, 800);
    } else {
      messageDiv.textContent = 'Invalid login credentials';
      messageDiv.className = 'error';
    }
  } catch (error) {
    messageDiv.textContent = 'Unable to process your request. Please try again';
    messageDiv.className = 'error';
  }
}

function goToCreateAccount() {
  const quickUsername = document.getElementById('quickUsername')?.value?.trim() || '';
  const quickPassword = document.getElementById('quickPassword')?.value || '';

  openCreateAccount();

  const signupUsername = document.getElementById('signupUsername');
  const signupPassword = document.getElementById('signupPassword');
  if (signupUsername && quickUsername) signupUsername.value = quickUsername;
  if (signupPassword && quickPassword) signupPassword.value = quickPassword;
}

function openCreateAccount() {
  showSection('auth');

  const tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length >= 2) {
    tabBtns[0].style.display = 'inline-block';
    tabBtns[1].style.display = 'inline-block';
  }

  toggleAuthTab('signup');
}

function populateComplaintAutoFields() {
  if (!currentUser) return;

  const complaintName = document.getElementById('complaintName');
  const complaintAge = document.getElementById('complaintAge');
  const complaintMobile = document.getElementById('complaintMobile');
  const complaintFlat = document.getElementById('complaintFlat');

  if (complaintName) complaintName.value = currentUser.fullName || currentUser.username || '';
  if (complaintAge) complaintAge.value = currentUser.age || '';
  if (complaintMobile) complaintMobile.value = currentUser.mobileNumber || '';
  if (complaintFlat && !complaintFlat.value) complaintFlat.value = currentUser.flat || '';
}

// ============ AUTHENTICATION ============

function toggleAuthTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const tabBtns = document.querySelectorAll('.tab-btn');

  if (!signupForm) return;

  if (tab === 'login' && loginForm && tabBtns.length >= 2) {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    tabBtns[0].classList.add('active');
    tabBtns[1].classList.remove('active');
  } else {
    if (loginForm) loginForm.classList.remove('active');
    signupForm.classList.add('active');
    if (tabBtns.length >= 2) {
      tabBtns[0].classList.remove('active');
      tabBtns[1].classList.add('active');
    }
  }
}

async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const messageDiv = document.getElementById('loginMessage');

  if (!email || !password) {
    messageDiv.textContent = 'Please fill in all required fields';
    messageDiv.className = 'error';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      currentUser = data.user;
      
      messageDiv.textContent = 'Login successful';
      messageDiv.className = 'success';
      
      setTimeout(() => {
        updateUIAfterLogin();
        showSection('dashboard');
        document.getElementById('loginForm').reset();
      }, 1000);
    } else {
      messageDiv.textContent = 'Invalid login credentials';
      messageDiv.className = 'error';
    }
  } catch (error) {
    messageDiv.textContent = 'Unable to process your request. Please try again';
    messageDiv.className = 'error';
  }
}

async function handleSignup(event) {
  event.preventDefault();

  const fullName = document.getElementById('signupFullName').value;
  const username = document.getElementById('signupUsername').value;
  const age = document.getElementById('signupAge').value;
  const door = document.getElementById('signupDoor').value;
  const flat = document.getElementById('signupFlat').value;
  const mobile = document.getElementById('signupMobile').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const messageDiv = document.getElementById('signupMessage');

  if (!fullName || !username || !age || !door || !flat || !mobile || !email || !password) {
    messageDiv.textContent = 'Please fill in all required fields';
    messageDiv.className = 'error';
    return;
  }

  if (!/^\d{10}$/.test(mobile)) {
    messageDiv.textContent = 'Please enter a valid mobile number';
    messageDiv.className = 'error';
    return;
  }

  if (password.length < 6) {
    messageDiv.textContent = 'Password must be at least 6 characters';
    messageDiv.className = 'error';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName,
        username,
        age,
        door,
        flat,
        mobileNumber: mobile,
        email,
        password
      })
    });

    const data = await response.json();

    if (response.ok) {
      messageDiv.textContent = 'Account created successfully';
      messageDiv.className = 'success';
      
      setTimeout(() => {
        document.getElementById('signupForm').reset();
        toggleAuthTab('login');
      }, 1500);
    } else {
      if ((data.message || '').toLowerCase().includes('username')) {
        messageDiv.textContent = 'This username is already taken';
      } else if ((data.message || '').toLowerCase().includes('email')) {
        messageDiv.textContent = 'An account already exists with this email';
      } else if ((data.message || '').toLowerCase().includes('password')) {
        messageDiv.textContent = 'Password must be at least 6 characters';
      } else {
        messageDiv.textContent = 'Unable to process your request. Please try again';
      }
      messageDiv.className = 'error';
    }
  } catch (error) {
    messageDiv.textContent = 'Unable to process your request. Please try again';
    messageDiv.className = 'error';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  if (loginForm) loginForm.reset();
  if (signupForm) signupForm.reset();
  
  updateUIAfterLogout();
  showSection('quickAccess');
}

function updateUIAfterLogin() {
  const loggedInBtns = ['dashboardBtn', 'complaintMenuBtn', 'feedbackMenuBtn', 'myComplaintsMenuBtn', 'logoutBtn'];
  loggedInBtns.forEach(id => {
    document.getElementById(id).style.display = 'inline-block';
  });

  if (currentUser && currentUser.isAdmin) {
    document.getElementById('adminMenuBtn').style.display = 'inline-block';
  }

  const tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length >= 2) {
    tabBtns[0].style.display = 'none';
    tabBtns[1].style.display = 'none';
  }
}

function updateUIAfterLogout() {
  const loggedInBtns = ['dashboardBtn', 'complaintMenuBtn', 'feedbackMenuBtn', 'myComplaintsMenuBtn', 'logoutBtn', 'adminMenuBtn'];
  loggedInBtns.forEach(id => {
    document.getElementById(id).style.display = 'none';
  });

  const tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length >= 2) {
    tabBtns[0].style.display = 'inline-block';
    tabBtns[1].style.display = 'inline-block';
  }

  toggleAuthTab('login');
}

// ============ SECTION NAVIGATION ============

function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');

  if (sectionId === 'complaint') {
    populateComplaintAutoFields();
  } else if (sectionId === 'myComplaints') {
    loadMyComplaints();
  } else if (sectionId === 'admin') {
    loadAdminStats();
    loadAdminComplaints();
  }
}

// ============ COMPLAINTS ============

async function handleComplaintSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('complaintName').value;
  const age = document.getElementById('complaintAge').value;
  const mobile = document.getElementById('complaintMobile').value;
  const flat = document.getElementById('complaintFlat').value;
  const description = document.getElementById('complaintDescription').value;
  const category = document.getElementById('complaintCategory').value;
  const priority = document.getElementById('complaintPriority').value;
  const evidenceFile = document.getElementById('complaintEvidence').files[0];
  const messageDiv = document.getElementById('complaintMessage');

  if (!name || !flat || !category || !priority || !description.trim()) {
    messageDiv.textContent = 'Please fill in all required fields';
    messageDiv.className = 'error';
    return;
  }

  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('description', description);
  formData.append('category', category);
  formData.append('priority', priority);
  formData.append('fullName', name);
  formData.append('age', age || '');
  formData.append('mobileNumber', mobile || '');
  formData.append('flatNumber', flat);
  if (evidenceFile) {
    formData.append('evidence', evidenceFile);
  }

  try {
    const response = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      messageDiv.textContent = 'Your complaint has been submitted successfully';
      messageDiv.className = 'success';
      document.getElementById('complaintForm').reset();
      populateComplaintAutoFields();
      loadMyComplaints();
      
      setTimeout(() => {
        messageDiv.textContent = '';
      }, 3000);
    } else {
      messageDiv.textContent = 'Unable to process your request. Please try again';
      messageDiv.className = 'error';
    }
  } catch (error) {
    messageDiv.textContent = 'Unable to process your request. Please try again';
    messageDiv.className = 'error';
  }
}

async function loadMyComplaints() {
  const token = localStorage.getItem('token');
  const tableBody = document.getElementById('complaintsTableBody');

  try {
    const response = await fetch(`${API_BASE}/complaints/my-complaints`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const complaints = await response.json();

    if (complaints.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="loading">You have not submitted any complaints yet</td></tr>';
      return;
    }

    tableBody.innerHTML = complaints.map(complaint => `
      <tr>
        <td>${complaint._id?.substring(0, 8) || 'N/A'}...</td>
        <td>${complaint.username || '-'}</td>
        <td>${complaint.age ?? '-'}</td>
        <td>${complaint.mobileNumber || '-'}</td>
        <td>${complaint.category}</td>
        <td>${new Date(complaint.createdAt).toLocaleDateString()}</td>
        <td><span class="status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}">${complaint.status}</span></td>
      </tr>
    `).join('');
  } catch (error) {
    tableBody.innerHTML = '<tr><td colspan="7" class="error">Unable to process your request. Please try again</td></tr>';
  }
}

// ============ FEEDBACK ============

function setRating(value) {
  currentRating = value;
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < value) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
  document.getElementById('ratingValue').textContent = `Rating: ${value}/5`;
}

async function handleFeedbackSubmit(event) {
  event.preventDefault();

  if (currentRating === 0) {
    alert('Please fill in all required fields');
    return;
  }

  const name = document.getElementById('feedbackName').value;
  const flat = document.getElementById('feedbackFlat').value;
  const comments = document.getElementById('feedbackComments').value;
  const category = document.getElementById('feedbackCategory').value;
  const isAnonymous = document.getElementById('feedbackAnonymous').checked;
  const messageDiv = document.getElementById('feedbackMessage');

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ rating: currentRating, comments, category, isAnonymous })
    });

    const data = await response.json();

    if (response.ok) {
      messageDiv.textContent = 'Your feedback has been recorded';
      messageDiv.className = 'success';
      document.getElementById('feedbackForm').reset();
      currentRating = 0;
      document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
      document.getElementById('ratingValue').textContent = 'Rating: 0/5';
      
      setTimeout(() => {
        messageDiv.textContent = '';
      }, 3000);
    } else {
      messageDiv.textContent = 'Unable to process your request. Please try again';
      messageDiv.className = 'error';
    }
  } catch (error) {
    messageDiv.textContent = 'Unable to process your request. Please try again';
    messageDiv.className = 'error';
  }
}

// ============ ADMIN ============

async function loadAdminStats() {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_BASE}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const stats = await response.json();

    document.getElementById('totalComplaints').textContent = stats.totalComplaints;
    document.getElementById('pendingComplaints').textContent = stats.pendingComplaints;
    document.getElementById('resolvedComplaints').textContent = stats.resolvedComplaints;
    document.getElementById('totalUsers').textContent = stats.totalUsers;
    document.getElementById('totalFeedback').textContent = stats.totalFeedback;
    document.getElementById('avgRating').textContent = stats.avgRating.toFixed(1);
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

async function loadAdminComplaints() {
  const token = localStorage.getItem('token');
  const complaintsList = document.getElementById('adminComplaintsList');

  try {
    const response = await fetch(`${API_BASE}/admin/complaints`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const complaints = await response.json();

    if (complaints.length === 0) {
      complaintsList.innerHTML = '<p class="loading">No complaints.</p>';
      return;
    }

    complaintsList.innerHTML = complaints.map(complaint => `
      <div class="complaint-item">
        <div class="item-header">
          <div>
            <div class="item-title">${complaint.category} by ${complaint.username}</div>
            <div class="item-meta">
              <span>📧 ${complaint.mobileNumber}</span>
              <span>🏠 Door: ${complaint.doorNumber}, Flat: ${complaint.flatNumber}</span>
            </div>
          </div>
          <span class="badge badge-${complaint.status.toLowerCase().replace(' ', '-')}">${complaint.status}</span>
        </div>
        <p class="item-description">${complaint.description}</p>
        <div style="margin: 15px 0;">
          <label>Update Status:</label>
          <select onchange="updateComplaintStatus('${complaint._id}', this.value)" style="margin-top: 5px;">
            <option value="Pending" ${complaint.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="In Progress" ${complaint.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Resolved" ${complaint.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
            <option value="Closed" ${complaint.status === 'Closed' ? 'selected' : ''}>Closed</option>
          </select>
        </div>
        <div style="margin: 15px 0;">
          <textarea placeholder="Add admin notes..." id="notes-${complaint._id}" style="width: 100%; padding: 10px; border-radius: 5px;" rows="2"></textarea>
          <button onclick="addAdminNotes('${complaint._id}')" class="btn btn-secondary btn-small" style="margin-top: 5px;">Save Notes</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    complaintsList.innerHTML = '<p class="error">Error loading complaints: ' + error.message + '</p>';
  }
}

async function updateComplaintStatus(complaintId, status) {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_BASE}/admin/complaints/${complaintId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      loadAdminComplaints();
      loadAdminStats();
    }
  } catch (error) {
    alert('Error updating complaint: ' + error.message);
  }
}

async function addAdminNotes(complaintId) {
  const notes = document.getElementById(`notes-${complaintId}`).value;
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_BASE}/admin/complaints/${complaintId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ adminNotes: notes })
    });

    if (response.ok) {
      alert('Notes saved successfully!');
      loadAdminComplaints();
    }
  } catch (error) {
    alert('Error saving notes: ' + error.message);
  }
}

async function loadAdminFeedback() {
  const token = localStorage.getItem('token');
  const feedbackList = document.getElementById('adminFeedbackList');

  try {
    const response = await fetch(`${API_BASE}/admin/feedback`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const feedbacks = await response.json();

    if (feedbacks.length === 0) {
      feedbackList.innerHTML = '<p class="loading">No feedback.</p>';
      return;
    }

    feedbackList.innerHTML = feedbacks.map(feedback => `
      <div class="feedback-item">
        <div class="item-header">
          <div>
            <div class="item-title">${feedback.category} - ${feedback.username}</div>
            <div class="item-meta">
              <span>⭐ Rating: ${feedback.rating}/5</span>
              <span>📅 ${new Date(feedback.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <p class="item-description">${feedback.comments}</p>
      </div>
    `).join('');
  } catch (error) {
    feedbackList.innerHTML = '<p class="error">Error loading feedback: ' + error.message + '</p>';
  }
}

function showAdminTab(tab) {
  const complaintsTab = document.getElementById('complaintsTab');
  const feedbackTab = document.getElementById('feedbackTab');
  const tabBtns = document.querySelectorAll('.admin-tab-btn');

  if (tab === 'complaints') {
    complaintsTab.classList.add('active');
    feedbackTab.classList.remove('active');
    tabBtns[0].classList.add('active');
    tabBtns[1].classList.remove('active');
  } else {
    complaintsTab.classList.remove('active');
    feedbackTab.classList.add('active');
    tabBtns[0].classList.remove('active');
    tabBtns[1].classList.add('active');
    loadAdminFeedback();
  }
}
