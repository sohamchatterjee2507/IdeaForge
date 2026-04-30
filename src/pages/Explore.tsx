import { useState, useEffect } from 'react';
import { ideaService } from '../lib/ideaService';
import { Idea } from '../types';
import IdeaCard from '../components/IdeaCard';
import { Search, Filter, SlidersHorizontal, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DOMAINS = ['All', 'AI/ML', 'Web Dev', 'IoT', 'Mechanical', 'Electrical', 'Civil', 'Chemical', 'Robotics', 'Embedded'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Explore() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  useEffect(() => {
    const fetchIdeas = async () => {
      const data = await ideaService.getAllIdeas(); // Default fetching only visible ones
      setIdeas(data);
      setLoading(false);
    };
    fetchIdeas();
  }, []);

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (idea.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === 'All' || idea.domain === selectedDomain;
    const matchesDifficulty = selectedDifficulty === 'All' || idea.difficulty === selectedDifficulty;
    return matchesSearch && matchesDomain && matchesDifficulty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <header className="mb-16 space-y-4">
        <div className="flex items-center space-x-3 text-brand-yellow font-black uppercase tracking-widest text-[10px]">
          <Sparkles className="w-4 h-4" />
          <span>The Mainframe Marketplace</span>
        </div>
        <h1 className="text-6xl font-black uppercase tracking-tighter italic text-white leading-none">Marketplace</h1>
        <p className="text-neutral-500 max-w-2xl font-medium text-lg leading-relaxed">
          Access high-grade engineering project blueprints vetted for industrial rigor. 
          Filter by domain and complexity to find your next technical breakthrough.
        </p>
      </header>

      <div className="grid lg:grid-cols-[280px_1fr] gap-16">
        {/* Filters Sidebar */}
        <aside className="space-y-12 hidden lg:block">
          <div className="sticky top-24 space-y-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-6 flex items-center">
                <Filter className="w-4 h-4 mr-3" /> Filter by Domain
              </h3>
              <div className="space-y-1">
                {DOMAINS.map(domain => (
                  <button
                    key={domain}
                    onClick={() => setSelectedDomain(domain)}
                    className={`block w-full text-left px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      selectedDomain === domain 
                      ? 'bg-brand-yellow text-neutral-900 italic' 
                      : 'text-neutral-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-6 flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-3" /> Complexity Level
              </h3>
              <div className="space-y-1">
                {DIFFICULTIES.map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`block w-full text-left px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      selectedDifficulty === diff 
                      ? 'bg-brand-yellow text-neutral-900 italic' 
                      : 'text-neutral-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="space-y-12">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-brand-yellow transition-colors" />
              <input
                type="text"
                placeholder="Search blueprints, technologies, logic systems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-white placeholder:text-neutral-600 focus:border-brand-yellow outline-none transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="min-h-[400px] relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-brand-yellow animate-spin mb-6" />
                <p className="text-neutral-600 font-black uppercase tracking-[0.2em] text-[10px]">Syncing with Forge Mainframe...</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid md:grid-cols-2 xl:grid-cols-3 gap-10"
                >
                  {filteredIdeas.map(idea => (
                    <motion.div
                      layout
                      key={idea.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <IdeaCard idea={idea} />
                    </motion.div>
                  ))}
                </motion.div>

                {filteredIdeas.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-40 bg-neutral-900/50 border-4 border-dashed border-neutral-900 rounded-[3rem]"
                  >
                    <Search className="w-20 h-20 text-neutral-800 mx-auto mb-8 animate-pulse" />
                    <h3 className="text-2xl font-black uppercase tracking-tight italic text-white mb-4">Search yields no results</h3>
                    <p className="text-neutral-600 font-medium mb-8">Try adjusting your search query or reset forge filters.</p>
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedDomain('All');
                        setSelectedDifficulty('All');
                      }}
                      className="text-brand-yellow font-black uppercase tracking-widest text-[10px] hover:underline"
                    >
                      Reboot Forge System
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
