import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { ideaService } from '../lib/ideaService';
import { Idea } from '../types';
import IdeaCard from '../components/IdeaCard';
import { Loader2, BookOpen, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyIdeas() {
  const { profile } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      const fetchPurchased = async () => {
        const data = await ideaService.getPurchasedIdeas(profile.uid);
        setIdeas(data);
        setLoading(false);
      };
      fetchPurchased();
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-yellow animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">My Forge</h1>
        <p className="text-neutral-500">The collection of project ideas you've unlocked. Happy engineering!</p>
      </header>

      {ideas.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} isPurchased={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-40 bg-neutral-800/10 border border-dashed border-neutral-800 rounded-3xl">
          <BookOpen className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No projects unlocked yet</h3>
          <p className="text-neutral-600 mb-8 max-w-sm mx-auto">
            You haven't purchased any project ideas yet. Explore our curated marketplace to find your next masterpiece.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center px-8 py-3 bg-brand-yellow text-neutral-900 rounded-xl font-bold transition-all hover:scale-105 glow-yellow"
          >
            <Compass className="w-5 h-5 mr-2" /> Explore Marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
