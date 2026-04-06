const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const logAudit = require('../utils/auditLogger');

// Register controller
exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role === 'admin' ? 'admin' : 'user'; // Assign role

  const query = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
  db.run(query, [username, hashedPassword, userRole], function(err) {
    if (err) {
      logAudit(null, username, 'REGISTER_FAILED', err.message, ip);
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'User already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    
    logAudit(this.lastID, username, 'REGISTER_SUCCESS', `User registered as ${userRole}`, ip);
    res.status(201).json({ message: 'User registered successfully' });
  });
};

// Login controller
exports.login = (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const query = `SELECT * FROM users WHERE username = ?`;
  db.get(query, [username], async (err, user) => {
    if (err) {
      logAudit(null, username, 'LOGIN_ERROR', err.message, ip);
      return res.status(500).json({ error: err.message });
    }
    
    if (!user) {
      logAudit(null, username, 'LOGIN_FAILED', 'User not found', ip);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      logAudit(user.id, username, 'LOGIN_FAILED', 'Incorrect password', ip);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // New: Update last login and IP
    const updateQuery = `UPDATE users SET last_login = CURRENT_TIMESTAMP, last_ip = ? WHERE id = ?`;
    db.run(updateQuery, [ip, user.id]);

    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    logAudit(user.id, username, 'LOGIN_SUCCESS', 'User logged in successfully', ip);
    res.status(200).json({ token, role: user.role });
  });
};
