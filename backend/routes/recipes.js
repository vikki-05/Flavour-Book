import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all recipes
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT r.Recipe_id, r.Recipe_name, r.Cooking_time, r.Difficulty_level, r.Description, r.Image_url,
                   c.Category_name, u.First_name, u.Last_name,
                   CONCAT(u.First_name, ' ', u.Last_name) AS Author,
                   IFNULL(AVG(rev.Rating), 0) as Average_rating
            FROM Recipe r
            LEFT JOIN Category c ON r.Category_id = c.Category_id
            LEFT JOIN User u ON r.User_id = u.User_id
            LEFT JOIN Review rev ON r.Recipe_id = rev.Recipe_id
            GROUP BY r.Recipe_id
            ORDER BY r.Recipe_id DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

// Search recipes by ingredient
router.get('/search', async (req, res) => {
    const { ingredient } = req.query;
    try {
        if (!ingredient) {
            return res.json([]);
        }
        
        const [rows] = await pool.query(`
            SELECT DISTINCT r.Recipe_id, r.Recipe_name, r.Cooking_time, r.Difficulty_level, r.Image_url,
                   c.Category_name, u.First_name, u.Last_name,
                   CONCAT(u.First_name, ' ', u.Last_name) AS Author,
                   IFNULL(AVG(rev.Rating), 0) as Average_rating
            FROM Recipe r
            JOIN Recipe_Ingredient ri ON r.Recipe_id = ri.Recipe_id
            JOIN Ingredients i ON ri.Ingredient_id = i.Ingredient_id
            LEFT JOIN Category c ON r.Category_id = c.Category_id
            LEFT JOIN User u ON r.User_id = u.User_id
            LEFT JOIN Review rev ON r.Recipe_id = rev.Recipe_id
            WHERE i.Ingredient_name LIKE ?
            GROUP BY r.Recipe_id
        `, [`%${ingredient}%`]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search recipes' });
    }
});

// GET recipe by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get recipe details
        const [recipeRows] = await pool.query(`
            SELECT r.Recipe_id, r.Recipe_name, r.Cooking_time, r.Difficulty_level, r.Description, r.Image_url,
                   c.Category_name, c.Category_id, u.First_name, u.Last_name,
                   CONCAT(u.First_name, ' ', u.Last_name) AS Author,
                   IFNULL(AVG(rev.Rating), 0) as Average_rating
            FROM Recipe r
            LEFT JOIN Category c ON r.Category_id = c.Category_id
            LEFT JOIN User u ON r.User_id = u.User_id
            LEFT JOIN Review rev ON r.Recipe_id = rev.Recipe_id
            WHERE r.Recipe_id = ?
            GROUP BY r.Recipe_id
        `, [id]);

        if (recipeRows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Get ingredients
        const [ingredientRows] = await pool.query(`
            SELECT i.Ingredient_name, ri.Quantity
            FROM Recipe_Ingredient ri
            JOIN Ingredients i ON ri.Ingredient_id = i.Ingredient_id
            WHERE ri.Recipe_id = ?
        `, [id]);

        res.json({
            ...recipeRows[0],
            ingredients: ingredientRows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch recipe' });
    }
});

// POST a new recipe
router.post('/', async (req, res) => {
    const { Recipe_name, Cooking_time, Difficulty_level, Description, Category_name, ingredients } = req.body;
    
    // Hardcoded User_id for demonstration (admin user)
    const User_id = 1; 

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Get or Create Category
        let Category_id = null;
        if (Category_name) {
            const [catRows] = await connection.query('SELECT Category_id FROM Category WHERE Category_name = ?', [Category_name]);
            if (catRows.length > 0) {
                Category_id = catRows[0].Category_id;
            } else {
                const [catResult] = await connection.query('INSERT INTO Category (Category_name) VALUES (?)', [Category_name]);
                Category_id = catResult.insertId;
            }
        }

        // 2. Insert Recipe
        const [recipeResult] = await connection.query(`
            INSERT INTO Recipe (Recipe_name, Cooking_time, Difficulty_level, Description, User_id, Category_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [Recipe_name, Cooking_time, Difficulty_level, Description, User_id, Category_id]);
        
        const Recipe_id = recipeResult.insertId;

        // 3. Process Ingredients
        if (ingredients && ingredients.length > 0) {
            for (let ing of ingredients) {
                const { Ingredient_name, Quantity } = ing;
                let Ingredient_id = null;

                // Check if ingredient exists
                const [ingRows] = await connection.query('SELECT Ingredient_id FROM Ingredients WHERE Ingredient_name = ?', [Ingredient_name]);
                if (ingRows.length > 0) {
                    Ingredient_id = ingRows[0].Ingredient_id;
                } else {
                    const [newIngResult] = await connection.query('INSERT INTO Ingredients (Ingredient_name) VALUES (?)', [Ingredient_name]);
                    Ingredient_id = newIngResult.insertId;
                }

                // Map recipe and ingredient
                await connection.query(`
                    INSERT INTO Recipe_Ingredient (Recipe_id, Ingredient_id, Quantity)
                    VALUES (?, ?, ?)
                `, [Recipe_id, Ingredient_id, Quantity]);
            }
        }

        await connection.commit();
        res.status(201).json({ message: 'Recipe created successfully', Recipe_id });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Failed to create recipe' });
    } finally {
        connection.release();
    }
});

export default router;
