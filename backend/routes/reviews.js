import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET reviews for a specific recipe
router.get('/:recipeId', async (req, res) => {
    try {
        const { recipeId } = req.params;
        const [rows] = await pool.query(`
            SELECT r.Review_id, r.Review_text, r.Rating, r.Review_date, u.First_name, u.Last_name
            FROM Review r
            JOIN User u ON r.User_id = u.User_id
            WHERE r.Recipe_id = ?
            ORDER BY r.Review_date DESC
        `, [recipeId]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// POST a review
router.post('/', async (req, res) => {
    const { Recipe_id, Review_text, Rating } = req.body;
    // Hardcoded User_id for demonstration
    const User_id = 1;

    try {
        const [result] = await pool.query(`
            INSERT INTO Review (Review_text, Rating, Review_date, User_id, Recipe_id)
            VALUES (?, ?, CURDATE(), ?, ?)
        `, [Review_text, Rating, User_id, Recipe_id]);
        
        res.status(201).json({ message: 'Review added successfully', Review_id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add review' });
    }
});

export default router;
