import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ideaService } from '../lib/ideaService';
import { Idea, IdeaContent } from '../types';
import { useAuth } from '../lib/AuthContext';
import { useCart } from '../lib/CartContext';
import { formatINR, toDate } from '../lib/utils';
import Markdown from 'react-markdown';
import { 
  ChevronLeft, 
  Calendar, 
  Lock, 
  Unlock, 
  BookOpen, 
  Loader2, 
  ShoppingCart,
  PlayCircle,
  Mail,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const { profile, signIn } = useAuth();
  const { items, addItem, purchases } = useCart();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [content, setContent] = useState<IdeaContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [activeMedia, setActiveMedia] = useState<string | null>(null);

  const purchaseForThisIdea = purchases.find(p => p.ideaId === id);
  const isPending = purchaseForThisIdea?.status === 'pending';

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const data = await ideaService.getIdeaById(id);
      setIdea(data);
      
      if (data && data.media && data.media.length > 0) {
        setActiveMedia(data.media[0]);
      }

      if (profile && id) {
        const owned = await ideaService.checkOwnership(profile.uid, id);
        setIsPurchased(owned || profile.role === 'admin');
        if (owned || profile.role === 'admin') {
          const contentData = await ideaService.getIdeaContent(id);
          setContent(contentData);
        }
      }
      setLoading(false);
    };
    load();
  }, [id, profile]);

  const isInCart = items.some(i => i.id === idea?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-brand-yellow animate-spin" />
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="pt-24 px-4 max-w-7xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Idea Not Found</h1>
        <Link to="/explore" className="text-brand-yellow hover:underline">Return to Marketplace</Link>
      </div>
    );
  }

  const isYoutube = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');
  const getYTId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <Link to="/explore" className="inline-flex items-center text-neutral-500 hover:text-white mb-8 transition-colors group">
        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-widest">Back to Marketplace</span>
      </Link>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left Column: Media & Header */}
        <div className="lg:col-span-8 space-y-8">
          <header>
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-neutral-800 text-neutral-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-neutral-700">
                {idea.domain}
              </span>
              <span className="px-3 py-1 bg-brand-yellow/10 text-brand-yellow text-[10px] font-black uppercase tracking-widest rounded-full border border-brand-yellow/20">
                {idea.difficulty}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white italic mb-4">
              {idea.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-neutral-500">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest leading-none">
                  Forged: {toDate(idea.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </header>

          {/* Media Player */}
          {idea.media && idea.media.length > 0 && (
            <div className="space-y-4">
              <div className="aspect-video bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 relative group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMedia}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full"
                  >
                    {activeMedia && isYoutube(activeMedia) ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${getYTId(activeMedia)}`}
                        className="w-full h-full border-0"
                        allowFullScreen
                      />
                    ) : (
                      <img src={activeMedia || ''} alt="Project Media" className="w-full h-full object-cover" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {idea.media.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMedia(m)}
                    className={`relative w-24 aspect-video rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeMedia === m ? 'border-brand-yellow scale-105 shadow-lg shadow-brand-yellow/20' : 'border-neutral-800'
                    }`}
                  >
                    {isYoutube(m) ? (
                      <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                        <PlayCircle className="w-6 h-6 text-brand-yellow" />
                      </div>
                    ) : (
                      <img src={m} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-black uppercase italic text-white flex items-center mb-6">
              <BookOpen className="w-6 h-6 mr-3 text-brand-yellow" /> Project Narrative
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed">{idea.description}</p>
          </div>

          {/* Locked Content */}
          <div className="relative mt-12 min-h-[300px]">
            {!isPurchased && (
              <div className="absolute inset-0 z-10 bg-neutral-950/60 backdrop-blur-md rounded-3xl flex items-center justify-center border border-neutral-800/50 p-8">
                <div className="text-center max-w-md">
                  <div className="p-4 bg-brand-yellow rounded-2xl w-fit mx-auto mb-6 shadow-2xl shadow-brand-yellow/20">
                    <Lock className="w-8 h-8 text-neutral-900" />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic text-white mb-4">Implementation Locked</h3>
                  <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                    Gain exclusive access to step-by-step assembly guides, source logic, and curated resource kits.
                  </p>
                  {!profile ? (
                    <button onClick={signIn} className="bg-brand-yellow text-neutral-900 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">
                      Sign In to Unlock
                    </button>
                  ) : isPending ? (
                    <button 
                      disabled
                      className="bg-neutral-800 text-neutral-500 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs cursor-default border border-neutral-700/20"
                    >
                      Awaiting Verification
                    </button>
                  ) : (
                    <button 
                      onClick={() => idea && addItem(idea)} 
                      disabled={isInCart}
                      className="bg-brand-yellow text-neutral-900 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                    >
                      {isInCart ? 'Added to Cart' : 'Join the Forge'}
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className={`space-y-12 ${!isPurchased ? 'grayscale blur-sm pointer-events-none select-none' : ''}`}>
               <section>
                <h2 className="text-2xl font-black uppercase italic text-white flex items-center mb-6">
                  <Unlock className="w-6 h-6 mr-3 text-green-400" /> Step-by-Step Forge
                </h2>
                <div className="bg-neutral-800/20 border border-neutral-800 p-8 rounded-3xl">
                  <div className="markdown-body">
                    <Markdown>{content?.implementationSteps || 'Steps will appear here once forged.'}</Markdown>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-black uppercase italic text-white flex items-center mb-6">
                  <BookOpen className="w-6 h-6 mr-3 text-brand-yellow" /> Resource Matrix
                </h2>
                <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl">
                   <div className="markdown-body">
                    <Markdown>{content?.resources || 'Resources listed here.'}</Markdown>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Cart */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="bg-neutral-800/40 border border-neutral-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 bg-brand-yellow rounded-bl-2xl">
                <ShoppingCart className="w-5 h-5 text-neutral-900" />
              </div>
              
              <div className="mb-8">
                <span className="text-[10px] uppercase font-black tracking-widest text-neutral-500 block mb-2">Acquisition Price</span>
                <div className="text-5xl font-black text-brand-yellow italic tracking-tighter leading-none pulse-yellow">
                  {formatINR(idea.price)}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-sm text-neutral-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                  <span>Full Implementation Manifest</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-neutral-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                  <span>Curated Tech Stack Resources</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-neutral-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                  <span>Lifetime Profile Access</span>
                </div>
              </div>

               {!isPurchased ? (
                isPending ? (
                  <button
                    disabled
                    className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center bg-neutral-800 text-neutral-500 cursor-default border border-neutral-700/20"
                  >
                    Awaiting Verification
                  </button>
                ) : (
                  <button
                    onClick={() => idea && addItem(idea)}
                    disabled={isInCart}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center transition-all active:scale-95 ${
                      isInCart 
                      ? 'bg-neutral-800 text-neutral-500' 
                      : 'bg-brand-yellow text-neutral-900 hover:bg-yellow-500 shadow-xl shadow-brand-yellow/10'
                    }`}
                  >
                    {isInCart ? <Check className="w-5 h-5 mr-2" /> : <ShoppingCart className="w-5 h-5 mr-2" />}
                    {isInCart ? 'Added to Cart' : 'Join the Forge'}
                  </button>
                )
              ) : (
                <div className="w-full bg-green-500/10 text-green-400 py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-green-500/20 text-center flex items-center justify-center">
                  <Check className="w-5 h-5 mr-2" /> Acquired
                </div>
              )}
            </div>

            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-4 px-2">Support & Assistance</h3>
              <a href="mailto:magiktrove@gmail.com" className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group">
                <div className="p-2 bg-neutral-800 rounded-xl group-hover:bg-brand-yellow/10 transition-colors">
                  <Mail className="w-5 h-5 text-neutral-500 group-hover:text-brand-yellow" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase italic">Contact Support</div>
                  <div className="text-[10px] font-mono text-neutral-500">magiktrove@gmail.com</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
