import pool from './db.js';

async function test() {
    try {
        const [rows] = await pool.query(`
            SELECT r.Recipe_id, r.Recipe_name, r.Cooking_time, r.Difficulty_level, r.Description, 
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
        console.log("Success:", rows.length);
    } catch (e) {
        console.error("DB Error:", e.message);
    }
    process.exit(0);
}
test();
