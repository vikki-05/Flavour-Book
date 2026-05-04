import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Save } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddRecipe() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Recipe_name: '',
    Cooking_time: '',
    Difficulty_level: 'Medium',
    Category_name: '',
    Description: ''
  });
  
  const [ingredients, setIngredients] = useState([{ Ingredient_name: '', Quantity: '' }]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch existing ingredients for suggestions
    axios.get('http://localhost:5000/api/ingredients')
      .then(res => setAvailableIngredients(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredientRow = () => {
    setIngredients([...ingredients, { Ingredient_name: '', Quantity: '' }]);
  };

  const removeIngredientRow = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        Cooking_time: parseInt(formData.Cooking_time),
        ingredients: ingredients.filter(i => i.Ingredient_name.trim() !== '')
      };
      
      const res = await axios.post('http://localhost:5000/api/recipes', payload);
      navigate(`/recipes/${res.data.Recipe_id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to add recipe. Check console for details.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-8 md:p-12"
      >
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">Create New <span className="text-gradient">Recipe</span></h1>
          <p className="text-slate-400">Share your culinary secrets with the world.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Recipe Name *</label>
              <input 
                type="text" 
                name="Recipe_name"
                required
                value={formData.Recipe_name}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                placeholder="e.g. Classic Margherita Pizza"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Category *</label>
              <input 
                type="text" 
                name="Category_name"
                required
                value={formData.Category_name}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                placeholder="e.g. Italian, Breakfast, Dessert"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Cooking Time (mins) *</label>
              <input 
                type="number" 
                name="Cooking_time"
                required
                min="1"
                value={formData.Cooking_time}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                placeholder="e.g. 45"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Difficulty Level</label>
              <select 
                name="Difficulty_level"
                value={formData.Difficulty_level}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Instructions *</label>
            <textarea 
              name="Description"
              required
              rows="6"
              value={formData.Description}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-orange-500 outline-none"
              placeholder="Step 1: Prep the ingredients..."
            />
          </div>

          <div className="pt-6 border-t border-slate-700/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Ingredients</h3>
              <button 
                type="button" 
                onClick={addIngredientRow}
                className="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center gap-1"
              >
                <Plus size={16} /> Add Ingredient
              </button>
            </div>
            
            <div className="space-y-3">
              {ingredients.map((ing, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-grow">
                    <input 
                      type="text" 
                      placeholder="Ingredient name (e.g. Tomato)" 
                      value={ing.Ingredient_name}
                      onChange={(e) => handleIngredientChange(index, 'Ingredient_name', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                      list="ingredient-suggestions"
                      required
                    />
                  </div>
                  <div className="w-1/3">
                    <input 
                      type="text" 
                      placeholder="Quantity (e.g. 2 cups)" 
                      value={ing.Quantity}
                      onChange={(e) => handleIngredientChange(index, 'Quantity', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                      required
                    />
                  </div>
                  {ingredients.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeIngredientRow(index)}
                      className="p-3 text-slate-500 hover:text-red-400 transition-colors bg-slate-900 rounded-xl border border-slate-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <datalist id="ingredient-suggestions">
              {availableIngredients.map(ing => (
                <option key={ing.Ingredient_id} value={ing.Ingredient_name} />
              ))}
            </datalist>
          </div>

          <div className="pt-6 text-center">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-orange-500/30 flex items-center gap-2 mx-auto disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><Save size={20} /> Publish Recipe</>
              )}
            </motion.button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
