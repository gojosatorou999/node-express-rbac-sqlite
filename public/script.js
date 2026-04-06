const apiUrl = '';

let token = localStorage.getItem('token') || null;
if (token) {
  document.getElementById('token-display').innerText = token;
  document.getElementById('logout-btn').style.display = 'block';
}

async function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;
  const statusDiv = document.getElementById('auth-status');

  if (!username || !password) {
    statusDiv.innerHTML = '<p class="error">Username and password required!</p>';
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    const data = await response.json();
    if (response.ok) {
      statusDiv.innerHTML = `<p class="success">${data.message}</p>`;
    } else {
      statusDiv.innerHTML = `<p class="error">${data.error}</p>`;
    }
  } catch (err) {
    statusDiv.innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
}

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const statusDiv = document.getElementById('auth-status');

  if (!username || !password) {
    statusDiv.innerHTML = '<p class="error">Username and password required!</p>';
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
      token = data.token;
      localStorage.setItem('token', token);
      statusDiv.innerHTML = `<p class="success">Logged in as ${data.role}!</p>`;
      document.getElementById('token-display').innerText = token;
      document.getElementById('logout-btn').style.display = 'block';
    } else {
      statusDiv.innerHTML = `<p class="error">${data.error}</p>`;
    }
  } catch (err) {
    statusDiv.innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
}

async function testRoute(route) {
  const resDiv = document.getElementById('test-result');
  resDiv.innerHTML = '<p class="placeholder">Testing...</p>';

  try {
    const response = await fetch(`${apiUrl}${route}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });
    const data = await response.json();
    if (response.ok) {
      resDiv.innerHTML = `
        <p class="success" style="font-weight: 700; font-size: 1.1rem;">ACCESS GRANTED</p>
        <p style="margin-top: 0.5rem;">${data.message}</p>
        <p class="placeholder" style="margin-top: 0.5rem;">(Role: ${data.role || 'None - Public'})</p>
      `;
    } else {
      resDiv.innerHTML = `
        <p class="error" style="font-weight: 700; font-size: 1.1rem;">ACCESS DENIED</p>
        <p style="margin-top: 0.5rem;">${data.error}</p>
        <p class="placeholder" style="margin-top: 0.5rem;">(Status: ${response.status})</p>
      `;
    }
  } catch (err) {
    resDiv.innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
}

function logout() {
  token = null;
  localStorage.removeItem('token');
  document.getElementById('token-display').innerText = 'None';
  document.getElementById('logout-btn').style.display = 'none';
  document.getElementById('auth-status').innerHTML = '<p class="success">Logged out successfully.</p>';
}
