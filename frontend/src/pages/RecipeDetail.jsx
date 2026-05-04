import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, ChefHat, Star, ArrowLeft, MessageSquare } from 'lucide-react';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ text: '', rating: 5 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipeRes = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(recipeRes.data);
        
        const reviewRes = await axios.get(`http://localhost:5000/api/reviews/${id}`);
        setReviews(reviewRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        Recipe_id: id,
        Review_text: newReview.text,
        Rating: newReview.rating
      });
      // Refresh reviews
      const reviewRes = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(reviewRes.data);
      setNewReview({ text: '', rating: 5 });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!recipe) {
    return <div className="text-center mt-20 text-2xl">Recipe not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/recipes" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-400 mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Recipes
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-3xl p-8 lg:p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px]" />
            
            <div className="relative z-10">
              <div className="text-orange-500 font-semibold mb-2">{recipe.Category_name}</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{recipe.Recipe_name}</h1>
              
              <div className="flex flex-wrap gap-6 mb-8 text-slate-300">
                <div className="flex items-center gap-2 bg-slate-800/50 py-2 px-4 rounded-xl">
                  <Clock size={20} className="text-orange-400"/> 
                  <span className="font-medium">{recipe.Cooking_time} mins</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 py-2 px-4 rounded-xl">
                  <ChefHat size={20} className="text-orange-400"/> 
                  <span className="font-medium">{recipe.Difficulty_level}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 py-2 px-4 rounded-xl">
                  <Star size={20} className="text-amber-400 fill-amber-400"/> 
                  <span className="font-medium">{Number(recipe.Average_rating).toFixed(1)} Rating</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-2xl font-semibold mb-4 text-white">Instructions</h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">
                  {recipe.Description || "No instructions provided."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Reviews Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-3xl p-8"
          >
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <MessageSquare size={24} className="text-orange-400" /> Reviews ({reviews.length})
            </h3>

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="mb-10 bg-slate-800/40 p-6 rounded-2xl border border-white/5">
              <h4 className="text-lg font-medium mb-4">Leave a Review</h4>
              <div className="mb-4">
                <label className="block text-sm text-slate-400 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star size={28} className={star <= newReview.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none mb-4"
                rows="3"
                placeholder="Share your thoughts about this recipe..."
                required
              />
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                Submit Review
              </button>
            </form>

            {/* Review List */}
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.Review_id} className="border-b border-slate-700/50 pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-lg text-orange-300">
                      {review.First_name} {review.Last_name}
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(review.Rating)].map((_, i) => <Star key={i} size={16} className="fill-amber-400" />)}
                    </div>
                  </div>
                  <p className="text-slate-300">{review.Review_text}</p>
                  <div className="text-xs text-slate-500 mt-2">
                    {new Date(review.Review_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {reviews.length === 0 && <p className="text-slate-500 italic">No reviews yet. Be the first!</p>}
            </div>
          </motion.div>
        </div>

        {/* Sidebar (Ingredients) */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-3xl p-8 sticky top-24"
          >
            <h3 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Ingredients</h3>
            <ul className="space-y-4">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex justify-between items-center text-slate-300 group hover:text-white transition-colors">
                  <span className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 group-hover:scale-150 transition-transform"/>
                    {ing.Ingredient_name}
                  </span>
                  <span className="font-medium text-slate-400 group-hover:text-orange-300">{ing.Quantity}</span>
                </li>
              ))}
            </ul>
            {recipe.ingredients.length === 0 && (
              <p className="text-slate-500 italic text-center">No ingredients listed.</p>
            )}
            
            <div className="mt-10 pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Recipe by</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
                  {recipe.First_name?.charAt(0)}{recipe.Last_name?.charAt(0)}
                </div>
                <div className="font-medium">{recipe.First_name} {recipe.Last_name}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
