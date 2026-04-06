const db = require('../config/db');

// Get all users
exports.getAllUsers = (req, res) => {
  const query = `SELECT id, username, role, last_login, last_ip FROM users`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Get audit logs
exports.getAuditLogs = (req, res) => {
  const query = `SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Update user role
exports.updateUserRole = (req, res) => {
  const { id, role } = req.body;
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const query = `UPDATE users SET role = ? WHERE id = ?`;
  db.run(query, [role, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User role updated successfully' });
  });
};
