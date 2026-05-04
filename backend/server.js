import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recipesRouter from './routes/recipes.js';
import ingredientsRouter from './routes/ingredients.js';
import reviewsRouter from './routes/reviews.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/recipes', recipesRouter);
app.use('/api/ingredients', ingredientsRouter);
app.use('/api/reviews', reviewsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
