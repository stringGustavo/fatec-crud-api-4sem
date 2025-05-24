import express from 'express';
import db from '../database/db.js'

const router = express.Router();

router.post('/create', async (req, res) => {
  const { use_name, use_email, use_birth, use_register } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO use_users (use_name, use_email, use_birth, use_register)
       VALUES (?, ?, ?, ?)`,
      [use_name, use_email, use_birth, use_register]
    );

    res.status(201).json({ id: result.insertId });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/selectAll', async (res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM use_users');

    res.json(rows);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/update/:id', async (req, res) => {
  const { use_name, use_email, use_birth, use_register, use_status } = req.body;
  
  try {
    const [result] = await db.execute(
      `UPDATE use_users SET use_name = ?, use_email = ?, use_birth = ?, use_register = ?, use_status = ?
       WHERE use_id = ?`,
      [use_name, use_email, use_birth, use_register, use_status, req.params.id]
    );
    res.json({ updated: result.affectedRows });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM use_users WHERE use_id = ?', [req.params.id]);

    res.json({ deleted: result.affectedRows });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
