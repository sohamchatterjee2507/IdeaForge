import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { ideaService } from '../lib/ideaService';
import { Idea, Purchase } from '../types';
import IdeaCard from '../components/IdeaCard';
import { Loader2, Box, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyIdeas() {
  const { profile } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (profile) {
        const purchasesData = await ideaService.getPurchases(false, profile.uid);
        setPurchases(purchasesData); // Keep all for status tracking

        const confirmedPurchases = purchasesData.filter(p => p.status === 'confirmed');
        const ideaPromises = confirmedPurchases.map(p => ideaService.getIdeaById(p.ideaId));
        const ideasData = await Promise.all(ideaPromises);
        setIdeas(ideasData.filter((i): i is Idea => i !== null));
      }
      setLoading(false);
    };
    load();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-yellow animate-spin" />
      </div>
    );
  }

  const pendingCount = purchases.filter(p => p.status === 'pending').length;

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto space-y-12">
      <header className="relative">
        <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white leading-none">The Vault</h1>
        <p className="text-brand-yellow font-mono text-xs uppercase tracking-widest mt-2">Your forged and acquired project blueprints</p>
      </header>

      {pendingCount > 0 && (
         <div className="bg-brand-yellow/10 border border-brand-yellow/20 p-6 rounded-3xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-brand-yellow rounded-2xl shadow-lg shadow-brand-yellow/20">
              <Box className="w-6 h-6 text-neutral-900" />
            </div>
            <div>
              <div className="text-lg font-black uppercase italic text-white leading-tight">
                {pendingCount} Pending Activation{pendingCount > 1 ? 's' : ''}
              </div>
              <p className="text-neutral-500 text-xs">Awaiting verification for your latest forge requests.</p>
            </div>
          </div>
          <Link to="/cart" className="hidden sm:flex items-center space-x-2 text-brand-yellow font-black uppercase text-[10px] tracking-widest hover:translate-x-1 transition-transform">
            <span>Checkout Guide</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {ideas.length === 0 ? (
        <div className="text-center py-24 bg-neutral-800/10 rounded-3xl border-2 border-dashed border-neutral-800">
           <ShieldCheck className="w-16 h-16 text-neutral-800 mx-auto mb-6" />
           <p className="text-neutral-500 font-bold uppercase tracking-widest mb-8">Your vault is currently empty.</p>
           <Link to="/explore" className="bg-neutral-800/50 hover:bg-neutral-800 text-white px-8 py-3 rounded-xl border border-white/5 font-black uppercase tracking-widest text-xs transition-all">
             Acquire Blueprints
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} isPurchased={true} />
          ))}
        </div>
      )}
    </div>
  );
}
