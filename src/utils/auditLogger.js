const db = require('../config/db');

const logAudit = (userId, username, action, details = '', ipAddress = '') => {
  const query = `INSERT INTO audit_logs (user_id, username, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [userId, username, action, details, ipAddress], (err) => {
    if (err) {
      console.error('Audit Log Error:', err.message);
    }
  });
};

module.exports = logAudit;
