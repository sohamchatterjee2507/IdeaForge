import { Idea } from '../types';
import { motion } from 'motion/react';
import { TrendingUp, ShoppingCart, Check, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { formatINR } from '../lib/utils';

interface IdeaCardProps {
  idea: Idea;
  isPurchased?: boolean;
}

export default function IdeaCard({ idea, isPurchased }: IdeaCardProps) {
  const { items, addItem } = useCart();
  const isInCart = items.some(i => i.id === idea.id);

  const difficultyColor: Record<string, string> = {
    Beginner: 'text-green-400 border-green-400/20 bg-green-400/5',
    Intermediate: 'text-brand-yellow border-brand-yellow/20 bg-brand-yellow/5',
    Advanced: 'text-red-400 border-red-400/20 bg-red-400/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card-tech group relative overflow-hidden rounded-2xl p-6 flex flex-col h-full bg-neutral-800/20 border-neutral-800/50"
    >
      {!idea.visible && (
        <div className="absolute top-0 right-0 bg-red-500/10 text-red-500 text-[10px] font-black px-2 py-1 flex items-center rounded-bl-lg border-l border-b border-red-500/20 z-10">
          <EyeOff className="w-3 h-3 mr-1" /> HIDDEN
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <span className="px-2 py-1 text-[10px] uppercase tracking-widest font-mono bg-neutral-900 border border-neutral-700 text-neutral-400 rounded">
          {idea.domain}
        </span>
        <span className={`px-2 py-1 text-[10px] uppercase tracking-widest font-mono border rounded ${difficultyColor[idea.difficulty] || 'text-neutral-400 border-neutral-700'}`}>
          {idea.difficulty}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-2 group-hover:text-brand-yellow transition-colors leading-tight min-h-[3rem]">
        {idea.title}
      </h3>
      
      <p className="text-neutral-500 text-sm mb-6 line-clamp-2">
        {idea.description}
      </p>

      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-brand-yellow font-black text-xl tracking-tighter">
            {formatINR(idea.price)}
          </div>
          <div className="flex items-center space-x-1.5 text-neutral-600 text-[10px] font-bold uppercase tracking-widest">
            <TrendingUp className="w-3 h-3" />
            <span>{idea.purchaseCount} Sales</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            to={`/idea/${idea.id}`}
            className="py-2.5 rounded-xl text-center text-xs font-black uppercase tracking-widest bg-neutral-800/50 text-white border border-white/5 hover:bg-neutral-800 transition-all"
          >
            Details
          </Link>
          
          {isPurchased ? (
            <Link
              to={`/idea/${idea.id}`}
              className="py-2.5 rounded-xl text-center text-xs font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20"
            >
              Unlocked
            </Link>
          ) : (
            <button
              onClick={() => addItem(idea)}
              disabled={isInCart}
              className={`flex items-center justify-center py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                isInCart 
                ? 'bg-neutral-800 text-neutral-500 cursor-default' 
                : 'bg-brand-yellow text-neutral-900 hover:scale-[1.02] active:scale-95 shadow-lg shadow-brand-yellow/10'
              }`}
            >
              {isInCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4 mr-1.5" />}
              {isInCart ? 'Added' : 'Cart'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
