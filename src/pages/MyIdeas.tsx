import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { ideaService } from '../lib/ideaService';
import { Idea, Purchase } from '../types';
import IdeaCard from '../components/IdeaCard';
import { Loader2, ShieldCheck, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatINR, toDate } from '../lib/utils';

export default function MyIdeas() {
  const { profile } = useAuth();
  const [ideas, setIdeas] = useState<(Idea & { purchaseDate: Date | null })[]>([]);
  const [pendingPurchases, setPendingPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (profile) {
        const purchasesData = await ideaService.getPurchases(false, profile.uid);

        // Separate pending and confirmed
        const pending = purchasesData.filter(p => p.status === 'pending');
        setPendingPurchases(pending);

        const confirmedPurchases = purchasesData.filter(p => p.status === 'confirmed');
        const ideaPromises = confirmedPurchases.map(async (p) => {
          const idea = await ideaService.getIdeaById(p.ideaId);
          if (idea) {
            return {
              ...idea,
              purchaseDate: p.createdAt ? toDate(p.createdAt) : null
            };
          }
          return null;
        });
        const ideasData = await Promise.all(ideaPromises);
        setIdeas(ideasData.filter((i): i is (Idea & { purchaseDate: Date | null }) => i !== null));
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

  const isVaultEmpty = pendingPurchases.length === 0 && ideas.length === 0;

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto space-y-12">
      <header className="relative">
        <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white leading-none">The Vault</h1>
        <p className="text-brand-yellow font-mono text-xs uppercase tracking-widest mt-2">Your forged and acquired project blueprints</p>
      </header>

      {isVaultEmpty ? (
        <div className="text-center py-24 bg-neutral-800/10 rounded-3xl border-2 border-dashed border-neutral-800">
           <ShieldCheck className="w-16 h-16 text-neutral-800 mx-auto mb-6" />
           <p className="text-neutral-500 font-bold uppercase tracking-widest mb-8">Your vault is currently empty.</p>
           <Link to="/explore" className="bg-neutral-800/50 hover:bg-neutral-800 text-white px-8 py-3 rounded-xl border border-white/5 font-black uppercase tracking-widest text-xs transition-all">
             Acquire Blueprints
           </Link>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Pending Acquisitions Section */}
          {pendingPurchases.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight italic text-white flex items-center">
                <Clock className="w-6 h-6 mr-3 text-brand-yellow animate-pulse" /> Pending Acquisitions
                <span className="ml-4 px-2 py-0.5 bg-neutral-800 text-neutral-500 rounded text-xs font-mono">{pendingPurchases.length}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingPurchases.map((purchase) => (
                  <div key={purchase.id} className="card-tech relative overflow-hidden rounded-2xl p-6 bg-neutral-800/10 border border-neutral-800/50 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                          Awaiting Verification
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          Ref ID: <span className="text-neutral-400 font-bold">{purchase.id}</span>
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mb-2 text-white">
                        {purchase.ideaTitle}
                      </h3>

                      <div className="text-xs text-neutral-400 space-y-1 mb-4 mt-3 font-mono">
                        <div>
                          Price: <span className="text-brand-yellow font-black italic">{formatINR(purchase.price || purchase.priceAtPurchase || 0)}</span>
                        </div>
                        <div>
                          Date: <span className="text-neutral-300">{purchase.createdAt ? toDate(purchase.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/10 text-xs text-neutral-400 leading-relaxed">
                      Payment verification is pending. Contact <a href="mailto:magiktrove@gmail.com" className="text-brand-yellow hover:underline">magiktrove@gmail.com</a> and provide your Reference ID.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Acquired Blueprints Section */}
          {ideas.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight italic text-white flex items-center">
                <Award className="w-6 h-6 mr-3 text-brand-yellow" /> Acquired Blueprints
                <span className="ml-4 px-2 py-0.5 bg-neutral-800 text-neutral-500 rounded text-xs font-mono">{ideas.length}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ideas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} isPurchased={true} purchaseDate={idea.purchaseDate || undefined} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
