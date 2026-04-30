import { useState, useEffect } from 'react';
import { ideaService } from '../lib/ideaService';
import { Idea } from '../types';
import IdeaCard from '../components/IdeaCard';
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

const DOMAINS = ['All', 'AI/ML', 'Web Dev', 'Mobile', 'IoT', 'Mechanical', 'Electrical', 'Civil', 'Chemical'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Explore() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  useEffect(() => {
    const fetchIdeas = async () => {
      const data = await ideaService.getAllIdeas();
      setIdeas(data);
      setLoading(false);
    };
    fetchIdeas();
  }, []);

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === 'All' || idea.domain === selectedDomain;
    const matchesDifficulty = selectedDifficulty === 'All' || idea.difficulty === selectedDifficulty;
    return matchesSearch && matchesDomain && matchesDifficulty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
        <p className="text-neutral-500 max-w-2xl">
          Browse through hundreds of engineering project ideas categorized by domain and difficulty. 
          Invest in your future with detailed implementation guides.
        </p>
      </header>

      <div className="grid lg:grid-cols-[240px_1fr] gap-10">
        {/* Filters Sidebar */}
        <aside className="space-y-8 hidden lg:block">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center">
              <Filter className="w-4 h-4 mr-2" /> Domain
            </h3>
            <div className="space-y-2">
              {DOMAINS.map(domain => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                    selectedDomain === domain ? 'bg-brand-yellow text-neutral-900 font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center">
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Difficulty
            </h3>
            <div className="space-y-2">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                    selectedDifficulty === diff ? 'bg-brand-yellow text-neutral-900 font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search ideas, technologies, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
               {/* Mobile Filter Pill indicators could go here */}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <Loader2 className="w-10 h-10 text-brand-yellow animate-spin mb-4" />
              <p className="text-neutral-500 font-mono text-sm">LOADING MARKETPLACE DATA...</p>
            </div>
          ) : filteredIdeas.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredIdeas.map(idea => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-neutral-800/10 border border-dashed border-neutral-800 rounded-3xl">
              <Search className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No results found</h3>
              <p className="text-neutral-600">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDomain('All');
                  setSelectedDifficulty('All');
                }}
                className="mt-6 text-brand-yellow font-bold text-sm uppercase tracking-widest hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
