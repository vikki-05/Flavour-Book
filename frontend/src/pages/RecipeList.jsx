import { useState, useEffect } from 'react';
import axios from 'axios';
import { RecipeCard } from './Home';
import { motion } from 'framer-motion';

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/recipes')
      .then(res => {
        setRecipes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load recipes. Please ensure the server is running.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">All <span className="text-gradient">Recipes</span></h1>
        <p className="text-slate-400 text-lg">Browse our complete collection of culinary delights.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-400 glass-panel rounded-2xl border-red-500/20">
          <p className="text-xl">{error}</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 text-slate-400 glass-panel rounded-2xl">
          <p className="text-xl">No recipes found. Be the first to add one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe, index) => (
            <RecipeCard key={recipe.Recipe_id} recipe={recipe} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
