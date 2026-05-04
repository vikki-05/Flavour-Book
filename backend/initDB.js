import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function initDB() {
    try {
        // Connect without specifying a database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        console.log("Connected to MySQL server");

        // Read schema file
        const schema = fs.readFileSync('schema.sql', 'utf8');

        console.log("Executing schema.sql...");
        await connection.query(schema);
        console.log("Database and tables created successfully!");

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error("Failed to initialize database:", error);
        process.exit(1);
    }
}

initDB();
