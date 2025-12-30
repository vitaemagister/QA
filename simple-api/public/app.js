const API_URL = 'http://localhost:3000';

// Utility function to display results
function showResult(elementId, data, isError = false) {
  const resultEl = document.getElementById(elementId);
  resultEl.classList.add('active');
  
  if (isError) {
    resultEl.classList.add('error');
    resultEl.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } else {
    resultEl.classList.remove('error');
    resultEl.classList.add('success');
    resultEl.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
}

// Get all users
async function getAllUsers() {
  try {
    const response = await fetch(`${API_URL}/users`);
    const data = await response.json();
    
    if (!response.ok) {
      showResult('usersList', data, true);
      return;
    }
    
    if (data.length === 0) {
      document.getElementById('usersList').innerHTML = '<p style="color: #999;">No users found</p>';
      document.getElementById('usersList').classList.add('active');
      return;
    }
    
    let html = '<div>';
    data.forEach(user => {
      html += `<div class="user-item">
        <strong>ID:</strong> ${user.id} | 
        <strong>Email:</strong> ${user.email} | 
        <strong>Created:</strong> ${new Date(user.created_at).toLocaleDateString('uk-UA')}
      </div>`;
    });
    html += '</div>';
    
    const resultEl = document.getElementById('usersList');
    resultEl.classList.add('active', 'success');
    resultEl.innerHTML = html;
  } catch (error) {
    showResult('usersList', { error: error.message }, true);
  }
}

// Get user by ID
async function getUserById() {
  const id = document.getElementById('userId').value.trim();
  
  if (!id) {
    alert('Please enter a User ID');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/users/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      showResult('singleUser', data, true);
      return;
    }
    
    showResult('singleUser', data, false);
  } catch (error) {
    showResult('singleUser', { error: error.message }, true);
  }
}

// Create new user
async function createUser() {
  const email = document.getElementById('newEmail').value.trim();
  const password = document.getElementById('newPassword').value.trim();
  
  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password_hash: password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      showResult('createResult', data, true);
      return;
    }
    
    showResult('createResult', data, false);
    document.getElementById('newEmail').value = '';
    document.getElementById('newPassword').value = '';
  } catch (error) {
    showResult('createResult', { error: error.message }, true);
  }
}

// Update user
async function updateUser() {
  const id = document.getElementById('updateId').value.trim();
  const email = document.getElementById('updateEmail').value.trim();
  const password = document.getElementById('updatePassword').value.trim();
  
  if (!id || !email || !password) {
    alert('Please fill in all fields');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password_hash: password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      showResult('updateResult', data, true);
      return;
    }
    
    showResult('updateResult', data, false);
    document.getElementById('updateId').value = '';
    document.getElementById('updateEmail').value = '';
    document.getElementById('updatePassword').value = '';
  } catch (error) {
    showResult('updateResult', { error: error.message }, true);
  }
}

// Delete user
async function deleteUser() {
  const id = document.getElementById('deleteId').value.trim();
  
  if (!id) {
    alert('Please enter a User ID');
    return;
  }
  
  if (!confirm(`Are you sure you want to delete user ${id}?`)) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      showResult('deleteResult', data, true);
      return;
    }
    
    showResult('deleteResult', data, false);
    document.getElementById('deleteId').value = '';
  } catch (error) {
    showResult('deleteResult', { error: error.message }, true);
  }
}
