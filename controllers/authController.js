const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
require('dotenv').config();


const generateUserId = () => {
    return 'USER' + Math.floor(10000 + Math.random() * 90000);
};

const isUserIdUnique = async (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT user_id FROM users WHERE user_id = ?';
        db.query(sql, [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results.length === 0);
        });
    });
};

const getUniqueUserId = async () => {
    let unique = false;
    let userId;

    while (!unique) {
        userId = generateUserId();
        unique = await isUserIdUnique(userId);
    }

    return userId;
};

const registerUser = async (req, res) => {
    const { name, phone, email, branch, year, password } = req.body;

    // Validate request body
    if (!name || !phone || !email || !branch || !year || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user already exists
    const sqlCheck = 'SELECT * FROM users WHERE email = ?';
    db.query(sqlCheck, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const userId = await getUniqueUserId();
            const sqlInsert = `INSERT INTO users (user_id, name, phone, email, branch, year, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            db.query(sqlInsert, [userId, name, phone, email, branch, year, hashedPassword], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'User registered successfully!' });
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};

const loginUser = (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(400).json({ message: 'Invalid email or password' });
  
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
  
      const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET);
      
      delete user.password;

      res.json({ user, token });
    });
  };

const forgotPassword = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and new password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `UPDATE users SET password = ? WHERE email = ?`;
    db.query(sql, [hashedPassword, email], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(400).json({ message: 'User not found' });

        res.json({ message: 'Password updated successfully!' });
    });
}

const getUserById = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const sql = `SELECT user_id, name, phone, email, branch, year FROM users WHERE user_id = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        res.json(results[0]);
    });
}

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    getUserById
}