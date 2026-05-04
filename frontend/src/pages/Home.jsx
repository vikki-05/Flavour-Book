import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, ChefHat, Star, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);

  useEffect(() => {
    // Fetch some recipes for the featured section
    axios.get('http://localhost:5000/api/recipes')
      .then(res => setFeaturedRecipes(res.data.slice(0, 3)))
      .catch(err => console.error(err));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/recipes/search?ingredient=${searchTerm}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
          >
            Discover the Art of <br/>
            <span className="text-gradient">Flavorful Cooking</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto"
          >
            Your ultimate virtual cookbook. Explore recipes, search by ingredients you have, and share your culinary masterpiece.
          </motion.p>

          <motion.form 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className="glass-panel p-2 rounded-full flex items-center max-w-2xl mx-auto border border-slate-700 shadow-2xl shadow-orange-900/20"
          >
            <div className="pl-4 text-slate-400"><Search size={24} /></div>
            <input 
              type="text" 
              placeholder="Search by ingredient (e.g., Tomato, Chicken)..." 
              className="flex-grow bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-slate-500 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 transition-colors text-white px-8 py-3 rounded-full font-semibold">
              Search
            </button>
          </motion.form>
        </div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-8">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((recipe, index) => (
              <RecipeCard key={recipe.Recipe_id} recipe={recipe} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Recipes */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Featured Recipes</h2>
            <p className="text-slate-400">Hand-picked selections for your next meal</p>
          </div>
          <Link to="/recipes" className="text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRecipes.map((recipe, index) => (
            <RecipeCard key={recipe.Recipe_id} recipe={recipe} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

// Separate component for reuse
export function RecipeCard({ recipe, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-panel rounded-2xl overflow-hidden hover:border-orange-500/50 transition-colors group flex flex-col h-full"
    >
      <div className="h-48 relative overflow-hidden">
        {recipe.Image_url ? (
          <img
            src={recipe.Image_url}
            alt={recipe.Recipe_name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-700 items-center justify-center"
          style={{ display: recipe.Image_url ? 'none' : 'flex' }}
        >
          <ChefHat size={64} className="text-slate-600 group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-amber-400 flex items-center gap-1 border border-white/10">
          <Star size={14} className="fill-amber-400" /> 
          {Number(recipe.Average_rating).toFixed(1)}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-orange-400 text-sm font-semibold mb-2">{recipe.Category_name || 'General'}</div>
        <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">{recipe.Recipe_name}</h3>
        
        <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
          <User size={16} className="text-orange-400" /> 
          <span>By <span className="font-medium text-white">{recipe.Author || 'Unknown'}</span></span>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-400 mb-6 mt-auto">
          <div className="flex items-center gap-1">
            <Clock size={16} /> {recipe.Cooking_time} mins
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              recipe.Difficulty_level === 'Easy' ? 'bg-green-400' : 
              recipe.Difficulty_level === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'
            }`} />
            {recipe.Difficulty_level}
          </div>
        </div>
        
        <Link to={`/recipes/${recipe.Recipe_id}`} className="block w-full text-center bg-white/5 hover:bg-orange-500 hover:text-white transition-all text-slate-300 font-medium py-3 rounded-xl border border-white/10">
          View Recipe
        </Link>
      </div>
    </motion.div>
  );
}
