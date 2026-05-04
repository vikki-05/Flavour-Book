import pool from './db.js';

const dummyRecipes = [
    {
        Recipe_name: 'Spicy Arrabbiata Pasta',
        Cooking_time: 25,
        Difficulty_level: 'Easy',
        Description: '1. Boil pasta in salted water.\n2. In a pan, heat olive oil and sauté minced garlic.\n3. Add crushed tomatoes, red chili flakes, and salt. Simmer for 10 minutes.\n4. Toss the cooked pasta in the sauce and serve hot with grated cheese.',
        Category_name: 'Italian',
        ingredients: [
            { Ingredient_name: 'Pasta', Quantity: '250g' },
            { Ingredient_name: 'Tomato', Quantity: '4 large' },
            { Ingredient_name: 'Garlic', Quantity: '3 cloves' },
            { Ingredient_name: 'Olive Oil', Quantity: '2 tbsp' },
            { Ingredient_name: 'Cheese', Quantity: '50g' }
        ]
    },
    {
        Recipe_name: 'Classic Chicken Curry',
        Cooking_time: 45,
        Difficulty_level: 'Medium',
        Description: '1. Marinate chicken with salt and spices.\n2. Fry onions until golden brown, then add garlic and ginger paste.\n3. Add tomatoes and cook until oil separates.\n4. Add chicken and simmer until cooked through. Serve with rice.',
        Category_name: 'Lunch',
        ingredients: [
            { Ingredient_name: 'Chicken', Quantity: '500g' },
            { Ingredient_name: 'Onion', Quantity: '2 medium' },
            { Ingredient_name: 'Tomato', Quantity: '2 medium' },
            { Ingredient_name: 'Garlic', Quantity: '4 cloves' }
        ]
    },
    {
        Recipe_name: 'Avocado Toast with Egg',
        Cooking_time: 10,
        Difficulty_level: 'Easy',
        Description: '1. Toast slices of bread until golden.\n2. Mash avocado with a pinch of salt and pepper.\n3. Fry or poach an egg.\n4. Spread avocado on toast and top with the egg.',
        Category_name: 'Breakfast',
        ingredients: [
            { Ingredient_name: 'Bread', Quantity: '2 slices' },
            { Ingredient_name: 'Avocado', Quantity: '1 whole' },
            { Ingredient_name: 'Egg', Quantity: '2 whole' },
            { Ingredient_name: 'Salt', Quantity: 'A pinch' },
            { Ingredient_name: 'Pepper', Quantity: 'A pinch' }
        ]
    }
];

async function seed() {
    try {
        console.log('Starting to seed recipes...');
        
        // Ensure an admin user exists
        await pool.query("INSERT IGNORE INTO User (User_id, First_name, Last_name, Email) VALUES (1, 'Admin', 'User', 'admin@flavourbook.com')");

        for (const recipe of dummyRecipes) {
            const { Recipe_name, Cooking_time, Difficulty_level, Description, Category_name, ingredients } = recipe;
            const User_id = 1;

            // 1. Get or Create Category
            let Category_id = null;
            if (Category_name) {
                const [catRows] = await pool.query('SELECT Category_id FROM Category WHERE Category_name = ?', [Category_name]);
                if (catRows.length > 0) {
                    Category_id = catRows[0].Category_id;
                } else {
                    const [catResult] = await pool.query('INSERT INTO Category (Category_name) VALUES (?)', [Category_name]);
                    Category_id = catResult.insertId;
                }
            }

            // 2. Insert Recipe
            const [recipeResult] = await pool.query(
                "INSERT INTO Recipe (Recipe_name, Cooking_time, Difficulty_level, Description, User_id, Category_id) VALUES (?, ?, ?, ?, ?, ?)",
                [Recipe_name, Cooking_time, Difficulty_level, Description, User_id, Category_id]);
            
            const Recipe_id = recipeResult.insertId;

            // 3. Process Ingredients
            for (let ing of ingredients) {
                const { Ingredient_name, Quantity } = ing;
                let Ingredient_id = null;

                const [ingRows] = await pool.query('SELECT Ingredient_id FROM Ingredients WHERE Ingredient_name = ?', [Ingredient_name]);
                if (ingRows.length > 0) {
                    Ingredient_id = ingRows[0].Ingredient_id;
                } else {
                    const [newIngResult] = await pool.query('INSERT INTO Ingredients (Ingredient_name) VALUES (?)', [Ingredient_name]);
                    Ingredient_id = newIngResult.insertId;
                }

                await pool.query(
                    "INSERT INTO Recipe_Ingredient (Recipe_id, Ingredient_id, Quantity) VALUES (?, ?, ?)",
                    [Recipe_id, Ingredient_id, Quantity]);
            }
            console.log(`Successfully added "${Recipe_name}"`);
        }
        
        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seed();
