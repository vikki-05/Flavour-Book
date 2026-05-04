import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all ingredients
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Ingredients ORDER BY Ingredient_name ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch ingredients' });
    }
});

export default router;
