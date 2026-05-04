import pool from './db.js';

const newRecipes = [
    {
        Recipe_name: 'Margherita Pizza',
        Cooking_time: 30,
        Difficulty_level: 'Medium',
        Description: '1. Preheat oven to 250°C.\n2. Roll out pizza dough on a floured surface.\n3. Spread tomato sauce evenly, leaving a border.\n4. Top with fresh mozzarella slices and basil leaves.\n5. Drizzle with olive oil and bake for 10-12 mins until crust is golden.',
        Category_name: 'Italian',
        Image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop',
        ingredients: [
            { Ingredient_name: 'Pizza Dough', Quantity: '250g' },
            { Ingredient_name: 'Tomato Sauce', Quantity: '4 tbsp' },
            { Ingredient_name: 'Mozzarella', Quantity: '150g' },
            { Ingredient_name: 'Basil', Quantity: 'A handful' },
            { Ingredient_name: 'Olive Oil', Quantity: '1 tbsp' }
        ]
    },
    {
        Recipe_name: 'Classic Beef Burger',
        Cooking_time: 20,
        Difficulty_level: 'Easy',
        Description: '1. Season ground beef with salt, pepper, and garlic powder. Form into patties.\n2. Grill or pan-fry on high heat for 3-4 mins each side.\n3. Toast the buns.\n4. Assemble with lettuce, tomato, onion, cheese, and your favourite sauce.',
        Category_name: 'American',
        Image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
        ingredients: [
            { Ingredient_name: 'Ground Beef', Quantity: '500g' },
            { Ingredient_name: 'Burger Buns', Quantity: '4' },
            { Ingredient_name: 'Cheese', Quantity: '4 slices' },
            { Ingredient_name: 'Lettuce', Quantity: '4 leaves' },
            { Ingredient_name: 'Tomato', Quantity: '1 large' }
        ]
    },
    {
        Recipe_name: 'Chicken Biryani',
        Cooking_time: 60,
        Difficulty_level: 'Hard',
        Description: '1. Marinate chicken in yoghurt, spices, lemon juice for 2 hours.\n2. Fry onions golden brown (birista). Cook marinated chicken.\n3. Layer partially cooked basmati rice over the chicken.\n4. Top with birista, saffron milk, and mint. Seal and cook on dum (low heat) for 20 mins.',
        Category_name: 'Indian',
        Image_url: 'https://images.unsplash.com/photo-1563379091339-03246963d26d?w=600&h=400&fit=crop',
        ingredients: [
            { Ingredient_name: 'Chicken', Quantity: '1 kg' },
            { Ingredient_name: 'Basmati Rice', Quantity: '500g' },
            { Ingredient_name: 'Onion', Quantity: '3 large' },
            { Ingredient_name: 'Yoghurt', Quantity: '200g' },
            { Ingredient_name: 'Saffron', Quantity: 'A pinch' }
        ]
    },
    {
        Recipe_name: 'Fluffy Pancakes',
        Cooking_time: 15,
        Difficulty_level: 'Easy',
        Description: '1. Whisk together flour, baking powder, sugar, and salt.\n2. In another bowl, beat egg, milk, and melted butter.\n3. Combine wet and dry ingredients until just mixed (lumps are fine).\n4. Cook on a greased pan over medium heat until bubbles form, then flip.',
        Category_name: 'Breakfast',
        Image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop',
        ingredients: [
            { Ingredient_name: 'All-purpose Flour', Quantity: '1 cup' },
            { Ingredient_name: 'Milk', Quantity: '1 cup' },
            { Ingredient_name: 'Egg', Quantity: '1' },
            { Ingredient_name: 'Baking Powder', Quantity: '2 tsp' },
            { Ingredient_name: 'Butter', Quantity: '2 tbsp' }
        ]
    },
    {
        Recipe_name: 'Greek Salad',
        Cooking_time: 10,
        Difficulty_level: 'Easy',
        Description: '1. Chop cucumber, tomatoes, and red onion into chunks.\n2. Add Kalamata olives and crumbled feta cheese.\n3. Drizzle generously with olive oil.\n4. Season with oregano, salt, and black pepper. Toss gently and serve.',
        Category_name: 'Mediterranean',
        Image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
        ingredients: [
            { Ingredient_name: 'Cucumber', Quantity: '1 large' },
            { Ingredient_name: 'Tomato', Quantity: '3 medium' },
            { Ingredient_name: 'Feta Cheese', Quantity: '100g' },
            { Ingredient_name: 'Olives', Quantity: '50g' },
            { Ingredient_name: 'Olive Oil', Quantity: '3 tbsp' }
        ]
    },
    {
        Recipe_name: 'Creamy Mushroom Pasta',
        Cooking_time: 25,
        Difficulty_level: 'Easy',
        Description: '1. Cook pasta in salted boiling water. Reserve ½ cup pasta water.\n2. Sauté sliced mushrooms in butter until golden.\n3. Add garlic, then pour in heavy cream. Simmer until thickened.\n4. Toss pasta in the sauce, adding pasta water to loosen. Top with Parmesan.',
        Category_name: 'Italian',
        Image_url: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&h=400&fit=crop',
        ingredients: [
            { Ingredient_name: 'Pasta', Quantity: '300g' },
            { Ingredient_name: 'Mushrooms', Quantity: '250g' },
            { Ingredient_name: 'Heavy Cream', Quantity: '200ml' },
            { Ingredient_name: 'Garlic', Quantity: '3 cloves' },
            { Ingredient_name: 'Parmesan', Quantity: '50g' }
        ]
    },
    {
        Recipe_name: 'Dal Makhani',
        Cooking_time: 50,
        Difficulty_level: 'Medium',
        Description: '1. Soak black lentils overnight, then pressure cook until soft.\n2. In a pan, cook onion, ginger-garlic paste, and tomato puree in butter.\n3. Add spices (cumin, coriander, garam masala).\n4. Add cooked lentils and simmer on very low heat for 30 mins, stirring often. Finish with cream.',
        Category_name: 'Indian',
        Image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop',
        ingredients: [
            { Ingredient_name: 'Black Lentils', Quantity: '200g' },
            { Ingredient_name: 'Butter', Quantity: '3 tbsp' },
            { Ingredient_name: 'Tomato', Quantity: '2 medium' },
            { Ingredient_name: 'Cream', Quantity: '4 tbsp' },
            { Ingredient_name: 'Garlic', Quantity: '4 cloves' }
        ]
    },
    {
        Recipe_name: 'Chocolate Lava Cake',
        Cooking_time: 15,
        Difficulty_level: 'Medium',
        Description: '1. Melt dark chocolate and butter together. Cool slightly.\n2. Whisk eggs, yolks, and sugar until fluffy. Fold in chocolate mixture.\n3. Add flour and fold gently until just combined.\n4. Pour into greased ramekins and bake at 200°C for exactly 12 minutes. Serve immediately.',
        Category_name: 'Dessert',
        Image_url: 'https://images.unsplash.com/photo-1617305855058-336d24456869?w=600&h=400&fit=crop',
        ingredients: [
            { Ingredient_name: 'Dark Chocolate', Quantity: '150g' },
            { Ingredient_name: 'Butter', Quantity: '80g' },
            { Ingredient_name: 'Egg', Quantity: '3' },
            { Ingredient_name: 'Sugar', Quantity: '60g' },
            { Ingredient_name: 'All-purpose Flour', Quantity: '2 tbsp' }
        ]
    }
];

// Update existing recipes with images
const existingRecipeImages = [
    { name: 'Spicy Arrabbiata Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop' },
    { name: 'Classic Chicken Curry', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop' },
    { name: 'Avocado Toast with Egg', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600&h=400&fit=crop' },
    { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop' },
];

async function addMoreRecipes() {
    try {
        console.log('Starting migration and seeding...');

        // Step 1: Add Image_url column if not exists
        try {
            await pool.query('ALTER TABLE Recipe ADD COLUMN IF NOT EXISTS Image_url VARCHAR(500)');
            console.log('Image_url column added.');
        } catch (e) {
            // Column might already exist, try without IF NOT EXISTS
            try {
                await pool.query('ALTER TABLE Recipe ADD COLUMN Image_url VARCHAR(500)');
                console.log('Image_url column added.');
            } catch (e2) {
                console.log('Image_url column already exists, continuing...');
            }
        }

        // Step 2: Update existing recipes with images
        for (const item of existingRecipeImages) {
            await pool.query('UPDATE Recipe SET Image_url = ? WHERE Recipe_name = ?', [item.image, item.name]);
            console.log(`Updated image for "${item.name}"`);
        }

        // Step 3: Insert new recipes
        const User_id = 1;
        for (const recipe of newRecipes) {
            const { Recipe_name, Cooking_time, Difficulty_level, Description, Category_name, Image_url, ingredients } = recipe;

            // Get or create category
            let Category_id = null;
            const [catRows] = await pool.query('SELECT Category_id FROM Category WHERE Category_name = ?', [Category_name]);
            if (catRows.length > 0) {
                Category_id = catRows[0].Category_id;
            } else {
                const [catResult] = await pool.query('INSERT INTO Category (Category_name) VALUES (?)', [Category_name]);
                Category_id = catResult.insertId;
            }

            // Check if recipe already exists to avoid duplicates
            const [existing] = await pool.query('SELECT Recipe_id FROM Recipe WHERE Recipe_name = ?', [Recipe_name]);
            let Recipe_id;
            if (existing.length > 0) {
                Recipe_id = existing[0].Recipe_id;
                await pool.query('UPDATE Recipe SET Image_url = ? WHERE Recipe_id = ?', [Image_url, Recipe_id]);
                console.log(`Updated image for existing recipe "${Recipe_name}"`);
            } else {
                const [recipeResult] = await pool.query(
                    'INSERT INTO Recipe (Recipe_name, Cooking_time, Difficulty_level, Description, User_id, Category_id, Image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [Recipe_name, Cooking_time, Difficulty_level, Description, User_id, Category_id, Image_url]
                );
                Recipe_id = recipeResult.insertId;

                // Insert ingredients
                for (const ing of ingredients) {
                    const { Ingredient_name, Quantity } = ing;
                    let Ingredient_id;
                    const [ingRows] = await pool.query('SELECT Ingredient_id FROM Ingredients WHERE Ingredient_name = ?', [Ingredient_name]);
                    if (ingRows.length > 0) {
                        Ingredient_id = ingRows[0].Ingredient_id;
                    } else {
                        const [newIng] = await pool.query('INSERT INTO Ingredients (Ingredient_name) VALUES (?)', [Ingredient_name]);
                        Ingredient_id = newIng.insertId;
                    }
                    await pool.query('INSERT INTO Recipe_Ingredient (Recipe_id, Ingredient_id, Quantity) VALUES (?, ?, ?)', [Recipe_id, Ingredient_id, Quantity]);
                }
                console.log(`Added "${Recipe_name}"`);
            }
        }

        console.log('\nAll done! Database updated successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

addMoreRecipes();
