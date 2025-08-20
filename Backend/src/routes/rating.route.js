const { Router } = require('express');
const pool = require('../db');

const router = Router();

// GET /api/ratings - Retrieve all ratings
router.get('/', async (req, res) => {
  try {
    const [ratings] = await pool.execute(
      `SELECT rating_id, user_id, store_id, rating_value, comment, created_at, updated_at FROM ratings`
    );
    res.json({ ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// GET /api/ratings/:storeid - Retrieve all ratings for a specific store
router.get('/:storeid', async (req, res) => {
    console.log("rating req..");
  const storeid = req.params.storeid;
  if (!storeid) {
    return res.status(400).json({ message: 'Store ID is required' });
  }
  
  try {
    const [ratings] = await pool.execute(
      `SELECT rating_id, user_id, store_id, rating_value, comment, created_at, updated_at FROM ratings WHERE store_id = ?`,
      [storeid]
    );
    res.json({ ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/ratings/user/:userid - Retrieve all ratings for a specific user
router.get('/user/:userid', async (req, res) => {
  const userid = req.params.userid;
  if (!userid) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  try {
    const [ratings] = await pool.execute(
      `SELECT rating_id, user_id, store_id, rating_value, comment, created_at, updated_at FROM ratings WHERE user_id = ?`,
      [userid]
    );
    res.json({ ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/ratings - Add a new rating
router.post('/', async (req, res) => {
  const { user_id, store_id, rating_value, comment } = req.body;
  if (!user_id || !store_id || !rating_value) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (rating_value < 1 || rating_value > 5) {
    return res.status(400).json({ message: 'Rating value must be between 1 and 5' });
  }
  try {
    const [result] = await pool.execute(
      `INSERT INTO ratings (user_id, store_id, rating_value, comment) VALUES (?, ?, ?, ?)`,
      [user_id, store_id, rating_value, comment || null]
    );
    res.status(201).json({ rating_id: result.insertId, message: 'Rating added successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'User has already rated this store' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/ratings/:rating_id - Delete a rating by rating_id
router.delete('/:rating_id', async (req, res) => {
  const rating_id = req.params.rating_id;
  if (!rating_id) {
    return res.status(400).json({ message: 'Rating ID is required' });
  }
  try {
    const [result] = await pool.execute(
      'DELETE FROM ratings WHERE rating_id = ?',
      [rating_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.json({ message: 'Rating deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
