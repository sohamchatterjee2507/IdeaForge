import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ideaService } from '../lib/ideaService';
import { Idea, IdeaContent } from '../types';
import { useAuth } from '../lib/AuthContext';
import { 
  ChevronLeft, 
  Calendar, 
  User, 
  Tag, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  BookOpen, 
  Loader2, 
  ShoppingCart,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [content, setContent] = useState<IdeaContent | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const { profile, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      const ideaData = await ideaService.getIdeaById(id);
      if (!ideaData) {
        navigate('/explore');
        return;
      }
      setIdea(ideaData);
      
      if (profile) {
        const owned = await ideaService.checkOwnership(profile.uid, id);
        setIsPurchased(owned || profile.role === 'admin');
        
        if (owned || profile.role === 'admin') {
          const contentData = await ideaService.getIdeaContent(id);
          setContent(contentData);
        }
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, [id, profile, navigate]);

  const handlePurchase = async () => {
    if (!profile) {
      await signIn();
      return;
    }
    
    if (!idea) return;
    
    setPurchasing(true);
    try {
      await ideaService.purchaseIdea(profile.uid, idea.id, idea.price);
      setIsPurchased(true);
      const contentData = await ideaService.getIdeaContent(idea.id);
      setContent(contentData);
    } catch (error) {
      console.error(error);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-brand-yellow animate-spin" />
      </div>
    );
  }

  if (!idea) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-neutral-500 hover:text-white mb-8 transition-colors text-sm font-mono uppercase tracking-widest"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="grid gap-12">
        {/* Header Section */}
        <section className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 text-xs uppercase tracking-widest font-mono bg-neutral-800 border border-neutral-700 text-neutral-400 rounded-full">
              {idea.domain}
            </span>
            <span className="px-3 py-1 text-xs uppercase tracking-widest font-mono bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow rounded-full">
              {idea.difficulty}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{idea.title}</h1>
          
          <div className="flex flex-wrap gap-6 text-sm text-neutral-500 font-mono">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-neutral-600" />
              <span>{new Date(idea.createdAt?.seconds * 1000).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-brand-yellow font-bold text-lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              <span>${idea.price}</span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="grid gap-10">
          <section className="space-y-4">
            <h2 className="text-xl font-bold border-b border-neutral-800 pb-2">Overview</h2>
            <p className="text-neutral-400 leading-relaxed whitespace-pre-wrap">{idea.description}</p>
          </section>

          {/* Locked / Unlocked Content */}
          <div className="relative">
            {!isPurchased ? (
              <div className="p-8 rounded-3xl bg-neutral-800/40 border border-neutral-700 border-dashed text-center">
                <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-neutral-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Implementation Details Locked</h3>
                <p className="text-neutral-500 max-w-md mx-auto mb-8">
                  Unlock implementation steps, resource links, and technical guidance by purchasing this project.
                </p>
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="inline-flex items-center px-10 py-4 bg-brand-yellow text-neutral-900 rounded-2xl font-bold hover:scale-105 transition-all glow-yellow disabled:opacity-50"
                >
                  {purchasing ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Zap className="w-5 h-5 mr-2" />
                  )}
                  Unlock for ${idea.price}
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono">
                  <Unlock className="w-3.5 h-3.5" />
                  <span className="tracking-widest uppercase">Content Unlocked</span>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <BookOpen className="w-6 h-6 mr-3 text-brand-yellow" /> Implementation Steps
                  </h2>
                  <div className="prose prose-invert max-w-none bg-neutral-800/40 border border-neutral-800 rounded-3xl p-8">
                    <Markdown>{content?.implementationSteps || 'Steps not available'}</Markdown>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Tag className="w-6 h-6 mr-3 text-brand-yellow" /> Resources & Tools
                  </h2>
                  <div className="prose prose-invert max-w-none bg-neutral-800/40 border border-neutral-800 rounded-3xl p-8">
                    <Markdown>{content?.resources || 'Resources not available'}</Markdown>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
