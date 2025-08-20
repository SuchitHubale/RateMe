const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = Router();

/**
 * User Signup
 */
router.post(
  '/signup',
  [
    body('name').isLength({ min: 3, max: 60 }).withMessage('Name must be between 3 and 60 chars'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('address').optional().isLength({ max: 400 }).withMessage('Address too long'),
    body('password')
      .isLength({ min: 8, max: 16 }).withMessage('Password must be 8-16 chars')
      .matches(/[A-Z]/).withMessage('At least one uppercase letter')
      .matches(/[^A-Za-z0-9]/).withMessage('At least one special character'),
    body('role').optional().isIn(['USER', 'OWNER', 'ADMIN']).withMessage('Invalid role')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { name, email, address, password, role = 'USER' } = req.body;

    try {
      // Check if users table is empty
      const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
      if (users[0].count === 0) {
        role = 'ADMIN';
      }

      const hash = await bcrypt.hash(password, 10);

      const [result] = await pool.execute(
        `INSERT INTO users (name, email, password_hash, address, role)
         VALUES (?, ?, ?, ?, ?)`,
        [name, email, hash, address || null, role]
      );

      return res.status(201).json({ user_id: result.insertId, message: 'User created successfully', role });
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Email already exists' });
      }
      console.error(e);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * User Login
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const [rows] = await pool.execute(
        'SELECT user_id, name, email, password_hash, role FROM users WHERE email = ?',
        [email]
      );

      const user = rows[0];
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign(
        { user_id: user.user_id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ token, user: { id: user.user_id, name: user.name, role: user.role } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
