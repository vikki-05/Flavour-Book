import { Link } from 'react-router-dom';
import { ChefHat, Search, PlusCircle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="glass-panel sticky top-0 z-50 py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: 180 }} 
            transition={{ duration: 0.5 }}
            className="text-orange-500"
          >
            <ChefHat size={32} />
          </motion.div>
          <span className="text-2xl font-bold tracking-tight text-white group-hover:text-orange-400 transition-colors">
            Flavour<span className="text-gradient">Book</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/" className="text-slate-300 hover:text-orange-400 transition-colors flex items-center gap-1">
            <Search size={18} /> Explore
          </Link>
          <Link to="/recipes" className="text-slate-300 hover:text-orange-400 transition-colors flex items-center gap-1">
            <BookOpen size={18} /> All Recipes
          </Link>
          <Link to="/add-recipe">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2 rounded-full font-semibold shadow-lg shadow-orange-500/30 flex items-center gap-2"
            >
              <PlusCircle size={18} /> Add Recipe
            </motion.button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
