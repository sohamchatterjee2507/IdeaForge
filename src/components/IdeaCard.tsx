import { Idea } from '../types';
import { motion } from 'motion/react';
import { Layers, Zap, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IdeaCardProps {
  idea: Idea;
  isPurchased?: boolean;
}

export default function IdeaCard({ idea, isPurchased }: IdeaCardProps) {
  const difficultyColor = {
    Beginner: 'text-green-400 border-green-400/20 bg-green-400/5',
    Intermediate: 'text-brand-yellow border-brand-yellow/20 bg-brand-yellow/5',
    Advanced: 'text-red-400 border-red-400/20 bg-red-400/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card-tech group relative overflow-hidden rounded-xl p-6 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="px-2 py-1 text-[10px] uppercase tracking-widest font-mono bg-neutral-900 border border-neutral-700 text-neutral-400 rounded">
          {idea.domain}
        </span>
        <span className={`px-2 py-1 text-[10px] uppercase tracking-widest font-mono border rounded ${difficultyColor[idea.difficulty]}`}>
          {idea.difficulty}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-2 group-hover:text-brand-yellow transition-colors leading-tight">
        {idea.title}
      </h3>
      
      <p className="text-neutral-400 text-sm mb-6 line-clamp-3">
        {idea.description}
      </p>

      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between text-neutral-300">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-brand-yellow" />
            <span className="font-mono text-lg font-bold">${idea.price}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-neutral-500 text-xs font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{idea.purchaseCount} purchases</span>
          </div>
        </div>

        <Link
          to={`/idea/${idea.id}`}
          className={`block w-full py-2.5 rounded-lg text-center text-sm font-bold transition-all ${
            isPurchased 
              ? 'bg-neutral-700 text-white hover:bg-neutral-600' 
              : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
          }`}
        >
          {isPurchased ? 'View Project' : 'Learn More'}
        </Link>
      </div>
    </motion.div>
  );
}
