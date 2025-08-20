const { Router } = require('express');
const pool = require('../db');

const router = Router();

// GET /api/users - Retrieve all users
router.get('/', async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT user_id, name, email, address, role, created_at FROM users'
    );
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/users/:user_id - Delete a user by user_id
router.delete('/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  console.log("user id : ",user_id);
  try {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE user_id = ?',
      [user_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
