const express = require('express');
const pool = require('../db');
const router = express.Router();


// GET /api/stores - Retrieve all stores
router.get('/', async (req, res) => {
  try {
    const [stores] = await pool.execute(
      `SELECT 
        s.store_id, 
        s.name, 
        s.email, 
        s.address, 
        s.category, 
        s.phone, 
        s.description, 
        s.owner_id, 
        s.created_at, 
        s.image_url,
        CAST(COALESCE(AVG(rt.rating_value), 0) AS DECIMAL(2,1)) AS average_rating,
        COUNT(rt.rating_id) AS review_count
      FROM stores s
      LEFT JOIN ratings rt ON s.store_id = rt.store_id
      GROUP BY s.store_id`
    );

    res.json({ stores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// POST /api/stores - Add a new store
router.post('/', async (req, res) => {
  const { name, email, address, category, phone, description, owner_id } = req.body;
  if (!name || !email || !address || !category || !owner_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const [result] = await pool.execute(
      `INSERT INTO stores (name, email, address, category, phone, description, owner_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, address, category, phone || null, description || null, owner_id]
    );
    res.status(201).json({ store_id: result.insertId, message: 'Store created successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/stores/:ownerid - Retrieve all stores for a specific owner
router.get('/:ownerid', async (req, res) => {
  const ownerid = req.params.ownerid;
  if (!ownerid) {
    return res.status(400).json({ message: 'Owner ID is required' });
  }
  console.log("finding....");
  try {
    const [stores] = await pool.execute(
      `SELECT store_id, name, email, address, category, phone, description, owner_id, created_at FROM stores WHERE owner_id = ?`,
      [ownerid]
    );
    res.json({ stores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/stores/:store_id - Update a store by store_id, including image_url
router.put('/:store_id', async (req, res) => {
  const store_id = req.params.store_id;
  console.log("updating imag....");
  const { name, email, address, category, phone, description, owner_id, image_url } = req.body;
  if (!name || !email || !address || !category || !owner_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const [result] = await pool.execute(
      `UPDATE stores SET name = ?, email = ?, address = ?, category = ?, phone = ?, description = ?, owner_id = ?, image_url = ? WHERE store_id = ?`,
      [name, email, address, category, phone || null, description || null, owner_id, image_url || null, store_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json({ message: 'Store updated successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/stores/:store_id - Delete a store by store_id
router.delete('/:store_id', async (req, res) => {
  const store_id = req.params.store_id;
  if (!store_id) {
    return res.status(400).json({ message: 'Store ID is required' });
  }
  try {
    const [result] = await pool.execute(
      'DELETE FROM stores WHERE store_id = ?',
      [store_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json({ message: 'Store deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
